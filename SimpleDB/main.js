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

    connectDB();
});

// 몽고디비 모듈 사용
var MongoClient = require('mongodb').MongoClient;
 
var database;

var connectDB = function() {
    // 데이터베이스 연결 정보
    var databaseUrl = 'mongodb://localhost:27017';
	
    // 데이터베이스 연결
    MongoClient.connect(databaseUrl, function(err, db) {
        if(err) throw err;
		
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
		
        // database 변수에 할당
        database = db.db('local');//local 데이터 베이스 선택!!
    });
};

var authUser = function(database, id, password, callback) {
    console.log('authUser 호출됨.');
	
    var users = database.collection('users');    
    users.find({"id" : id, "password" : password}).toArray(function(err, docs) {
    //users.find({}).toArray(function(err, docs) {
        if(err) {
            callback(err, null);
            return;
        }
		
        if(docs.length > 0) {
            console.log('아이디 [%s], 비밀번호 [%s]가 일치하는 사용자 찾음.', id, password);
            callback(null, docs);
        } else {
            console.log("일치하는 사용자를 찾지 못함.");
            callback(null, null);
        }
    });
};

var addUser = function(database, id, pass, name, callback){
    console.log('add user 호출됨');
    var users = database.collection('users');
    users.insertMany([{'id':id, "password":pass, 'name':name}], function(err, result){
        if(err) {
            callback(err, null);
            return;
        }
        
        if(result.insertedCount > 0){
            console.log("사용자 레코드 추가됨: " + result.insertedCount);            
        }
        else {
            console.log('추가된 레코드 없음..');
        }
        
        callback(null, result);
    });
};

router.route('/process/login').post(function(req, res){
    console.log('/process/login processing.....');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    if(database) {
        authUser(database, paramId, paramPassword, function(err, docs) {
            console.log("callback run.....");
            if(err) {throw err;}
            
            if(docs) {
                console.log('....to client...');
                var username = docs[0].name;
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>login success...</h1>');
                res.write('id : ' + paramId + ' user : ' + username );
                res.end();
            }
            else {
                res.write('<h1>login fail...</h1>');
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
    
    if(database){
        addUser(database, paramId, paramPW, paramName, function(err, result){
            if(err) throw err;
            
            if(result && result.insertedCount > 0) {
                console.dir(result);
                
                res.writeHead('200', {'Content-TYpe':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 성공...</h2>');
                res.end();
            }
            else {
                res.writeHead('200', {'Content-TYpe':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 실패...</h2>');
                res.end();
            }
        });
        
    }
    else {
        res.writeHead('200', {'Content-TYpe':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});

app.use('/', router);
