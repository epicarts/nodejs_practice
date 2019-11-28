// Express 기본 모듈 불러오기
var express = require('express'), http = require('http'), path = require('path');
// Express의 미들웨어 불러오기
var bodyParser = require('body-parser'), cookieParser = require('cookie-parser'), static = require('serve-static');
// Session 미들웨어 불러오기
var expressSession = require('express-session');
// 익스프레스 객체 생성
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'html')));

app.use(cookieParser());
app.use(expressSession({
	secret:'my key',
	resave: true,
	saveUninitialized:true
}));

http.createServer(app).listen(3000, function(){
    console.log("express server start......");
});

//===== MySQL 데이터베이스를 사용할 수 있는 mysql 모듈 불러오기 =====//
var mysql = require('mysql');

//===== MySQL 데이터베이스 연결 설정 =====//
var pool = mysql.createPool({
    connectionLimit : 10, 
    host : 'localhost',
    user : 'root',
    password : '2019',
    database : 'test',
    debug : false
});


var authUser = function(id, password, callback) {
    console.log('authUser 호출됨.');
	
    // 커넥션 풀에서 연결 객체를 가져옵니다.
    pool.getConnection(function(err, conn) {
        if (err) {
            if (conn) {
                conn.release(); // 반드시 해제해야 합니다.
            }
            callback(err, null);
            return;
        } 
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
        
        var columns = ['id', 'name', 'age'];
        var tablename = 'users';
        // SQL문을 실행합니다.
        var exec = conn.query("select ?? from ?? where id = ? and password = ?", [columns, tablename, id, password], function(err, rows) {
            conn.release(); // 반드시 해제해야 합니다.
            console.log('실행 대상 SQL : ' + exec.sql);
            if(rows.length > 0) {
                console.log('아이디 [%s], 패스워드 [%s] 가 일치하는 사용자 찾음.', id, password);
                callback(null, rows);
            } else {
                console.log("일치하는 사용자를 찾지 못함.");
                callback(null, null);
            }
        });
    });
};

var addUser = function(id, name, age, pass, callback){
    console.log('addUser 호출됨.');
	
    // 커넥션 풀에서 연결 객체를 가져옵니다.
    pool.getConnection(function(err, conn) {
        if (err) {
            if (conn) {
                conn.release(); // 반드시 해제해야 합니다.
            }
            callback(err, null);
            return;
        } 
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
        
        var data = {id:id, name:name, age:age, password:pass};
        
        // SQL문을 실행합니다.
        var exec = conn.query('insert into users set ?', data, function(err, result) {
            conn.release(); // 반드시 해제해야 합니다.
            console.log('실행 대상 SQL : ' + exec.sql);
            
            if(err) {
                console.log('SQL 실행 시 오류 발생함.');
                console.dir(err);
                
                callback(err, null);	
                return;
            }
            callback(null, result);
        });
    });
};


router.route('/process/login').post(function(req, res){
    console.log('/process/login processing.....');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    if(pool) {
        authUser(paramId, paramPassword, function(err, rows) {
            if(err) {
                console.error('사용자 로그인 중 오류 발생....: ' + err.stack);
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 로그인 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');	 
                res.end();
                
                return;
            }           
            
            if(rows) {
                console.dir(rows);
                var username = rows[0].name;
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
                res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
                res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
                res.end();
            }
        });
    } else {
        res.write('<h1>connection error....</h1>');
        res.end();
    }
});

router.route('/process/adduser').post(function(req, res){
    console.log('/process/adduser 호출됨');
    
    var paramId = req.body.id;
    var paramPW = req.body.pass;    
    var paramName = req.body.name;
    var paramAge = req.body.age;
    
    if(pool) {
        addUser(paramId, paramName, paramAge, paramPW, function(err, addedUser) {
            // 동일한 id로 추가할 때 오류 발생 - 클라이언트로 오류 전송
            if (err) {
                console.error('사용자 추가 중 오류 발생 : ' + err.stack);
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            
            if (addedUser) {
                console.dir(addedUser);
                console.log('inserted ' + addedUser.affectedRows + ' rows');
                var insertId = addedUser.insertId;
                console.log('추가한 레코드의 아이디 : ' + insertId);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 성공</h2>');
                res.end();
            } else {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 실패</h2>');
                res.end();
            }
        });
    } else { // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }                
});
    
app.use('/', router);