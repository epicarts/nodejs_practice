/////moudle
var http = require('http');
var express = require('express');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var multer = require('multer');// 파일 업로드용 미들웨어
var fs = require('fs');
var cors = require('cors');//클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
var MongoClient = require('mongodb').MongoClient;

/////create
var app = express();


///middleware
app.use(bodyParser.urlencoded({extended:false}));//html
app.use(bodyParser.json());//json

app.use('/public', static(path.join(__dirname, 'html')));

var router = express.Router();
app.use('/', router);

//serverstart
http.createServer(app).listen(3000, function(){
    console.log("express server start......");
    connectDB(); // db연결 시도
});

var database;
var connectDB = function(){
    var databaseUrl = 'mongodb://localhost:27017'
    
    MongoClient.connect(databaseUrl, function(err, db){
        if(err) throw err;
        
        console.log("데이터베이스 연결 성공..!");
        
        database = db.db('local'); // 책하고 다른 부분!!!!!!외워놓거나 적어놓기
    });
    
};


router.route('/process/login').post(function(req, res){
    var id = req.body.id;
    var pw = req.body.pw;
    
    var users = database.collection('users');//collection 은 table 같은 역할
    users.find({'id':id, 'password':pw}).toArray(function(err, docs){
        console.dir(docs);
    });//필드명 id: 클라이언트 id   / 
    
    
});
