// Express 기본 모듈 불러오기
var express = require('express'), http = require('http'), path = require('path');
// Express의 미들웨어 불러오기
var bodyParser = require('body-parser'), cookieParser = require('cookie-parser'), static = require('serve-static');
// Session 미들웨어 불러오기
var expressSession = require('express-session');
var user = require('./routes/user');


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

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// var user = require('./routes/user2'); 로 변경해 주면됨



http.createServer(app).listen(3000, function(){
    console.log("express server start......");

    connectDB();
});


// 몽고디비 모듈 사용
var mongodb = require('mongodb');
var mongoose = require('mongoose');
 
var database;
var UserSchema;
var UserModel;


var connectDB = function() {
    // 데이터베이스 연결 정보
    var databaseUrl = 'mongodb://localhost:27017/local';
	
    // 데이터베이스 연결
    console.log('데이터베이스 연결을 시도합니다....');
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    
    database.on('error', console.error.bind(console, 'mongoose connection error.'));	
    database.on('open', function () {
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
        
        // 스키마 및 모델 객체 생성
        createUserSchema();
        
    });
    
    database.on('disconnected', function(){
        console.log('연결이 끊어졌습니다. 5초 후에 다시 연결합니다.');
        setInterval(connectDB, 5000);
    });    
};

var createUserSchema = function (){
    
    // user_schema.js 모듈 불러오기
    UserSchema = require('./database/user_schema').createSchema(mongoose);
    
    // UserModel 모델 정의
    UserModel = mongoose.model("users3", UserSchema);
    console.log('users 정의함.');
    
    // init 호출
    user.init(database, UserSchema, UserModel);
}

router.route('/process/login').post(user.login);

router.route('/process/adduser').post(user.adduser);
    
router.route('/process/listuser').post(user.listuser);                
                

app.use('/', router);