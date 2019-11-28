// Express 기본 모듈 불러오기
var express = require('express'), http = require('http'), path = require('path');
// Express의 미들웨어 불러오기
var bodyParser = require('body-parser'), cookieParser = require('cookie-parser'), static = require('serve-static');
// Session 미들웨어 불러오기
var expressSession = require('express-session');
// 익스프레스 객체 생성
var app = express();
var router = express.Router();
var multer = require('multer');// 파일 업로드용 미들웨어

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'html')));
app.use('/uploads', static(path.join(__dirname, 'uploads'))) //파일 업로드 기능 추가

app.use(cookieParser());
app.use(expressSession({
	secret:'my key',
	resave: true,
	saveUninitialized:true
}));

//파일 업로드 기능 추가
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads')//uploads 라는 폴더에 저장 할 수 있음.
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname + Date.now())
    }
});

var upload = multer({ 
    storage: storage,
    limits: {
        files: 10,
        fileSize: 1024 * 1024 * 1024
    }
});

http.createServer(app).listen(3000, function(){
    console.log("express server start......");

    connectDB();
});


// 몽고디비 모듈 사용
// var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
 
var database;
var UserSchema;//몽구스를 쓸때는 스키마를 써줘야함
var UserModel;


var connectDB = function() {
    // 데이터베이스 연결 정보
    var databaseUrl = 'mongodb://localhost:27017/local';//LOCAL이라는 데이터 베이스까지 추가!
	
    // 데이터베이스 연결
    console.log('데이터베이스 연결을 시도합니다....');
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    
    database.on('error', console.error.bind(console, 'mongoose connection error.'));	
    database.on('open', function () {
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
        
        // 스키마 정의
        UserSchema = mongoose.Schema({//총 6컬럼
            id: {type: String, required: true, unique: true},//string 문자열, required 필수 항목 
            password:{type: String, required: true},
            name: {type: String, index: 'hashed', 'default':''},
            age: {type: Number, 'default': -1},
            created_at : {type : Date, index : {unique : false}, 'default' : Date.now},
            updated_at : {type : Date, index : {unique : false}, 'default' : Date.now}
        });
        
        UserSchema.static('findById', function(id, callback) {
            return this.find({id : id}, callback);
        });
        
        UserSchema.static('findAll', function(callback) {
            return this.find({ }, callback);
        });
        
        console.log('UserSchema 정의함.');
        
        // UserModel 모델 정의
        UserModel = mongoose.model("users_schema", UserSchema);//컬렉션 이름. 테이블. / 필드명은 usersSchema에 담겨 있음.
        console.log('users 정의함.');
        console.log('UserModel 정의함.');
    });
    
    database.on('disconnected', function(){
        console.log('연결이 끊어졌습니다. 5초 후에 다시 연결합니다.');
        setInterval(connectDB, 5000);
    });    
};

var authUser = function(database, id, password, callback) {
    console.log('authUser 호출됨.....');
	
    // 1. 아이디를 사용해 검색
    UserModel.findById(id, function(err, results) {
        if(err) {
            callback(err, null);
            return;
        }
        
        console.log('아이디 [%s]로 사용자 검색 결과', id);
        console.dir(results);
        
        if(results.length > 0) {
            console.log('아이디와 일치하는 사용자 찾음.');
			
            // 2. 비밀번호 확인
            if(results[0]._doc.password === password) {
                console.log('비밀번호 일치함');
                callback(null, results);
            } else {
                console.log('비밀번호 일치하지 않음');
                callback(null, null);
            }            
        } else {
            console.log("아이디와 일치하는 사용자를 찾지 못함.");
            callback(null, null);
        }   
    });
};

var addUser = function(database, id, pass, name, callback){
    console.log('add user 호출됨....');
        
    var user = new UserModel({"id":id, "password":pass, 'name':name});
    
    user.save(function(err){
        if(err) {
            callback(err, null);
            return;
        }
        console.log('사용자 추가됨....');
        callback(null, user);
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
    var file = req.body.photo;
    
    if(database){
        addUser(database, paramId, paramPW, paramName, function(err, user){
            if(err) throw err;
            
            if(user) {
                console.dir(user);
                
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
    
router.route('/process/listuser').post(function(req, res) {
    console.log('/process/listuser 호출됨.');
                
    if(database) {
        // 1. 모든 사용자 검색
        UserModel.findAll(function(err, results) {
            if (err) {
                console.error('사용자 리스트 조회 중 오류 발생 : ' + err.stack);
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 리스트 조회 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            if (results) { // 결과 객체 있으면 리스트 전송
                console.dir(results);
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 리스트</h2>');
                res.write('<div><ul>');
                
                for (var i = 0; i < results.length; i++) {
                    var curId = results[i]._doc.id;
                    var curName = results[i]._doc.name;
                    var href = '/process/detail?id=' + curId;
                    //var link = '<a href="' + href + '">상세보기</a>';
                    var curID_href = '<a href=\"' + href + '\">' + curId + '</a>';

                    res.write(' <li>#' + i + ' : ' + curID_href + ', ' + curName + '</li>');
                }	
                
                res.write('</ul></div>');
                res.end();
            } else { // 결과 객체가 없으면 실패 응답 전송
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 리스트 조회 실패</h2>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', {'Content-TYpe':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});

router.route('/process/detail').get(function(req, res) {
    var paramId = req.query.id;
    
    console.log(paramId);
    
    res.writeHead('200', {'Content-TYpe':'text/html;charset=utf8'});
    res.write('<h2>'+ paramId + '의 상세 정보 페이지</h2>');
    res.write('<img src="/uploads/"' + imgPath + 'width=200>');
    res.end();
});

app.use('/', router);







