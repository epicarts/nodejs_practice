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


//router.route('/process/login').post(function(req, res){
//    var id = req.body.id;
//    var pw = req.body.pw;
//    
//    var users = database.collection('users');//collection 은 table 같은 역할
//    users.find({'id':id, 'password':pw}).toArray(function(err, docs){
//        console.dir(docs);
//        
//        name = docs[0].name;
//    });//필드명 id: 클라이언트 id   / 
//    
//    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
//    res.write("로그인 사용자: "+ name);
//    res.end();
//    
//});

var authuser = function(database, id, pw, callback){//꼮꼮 공부하기 callback 함수 만드는 법..!
    console.log("authuser함수")
    var users = database.collection('users'); //database
    
    users.find({'id':id, 'password':pw}).toArray(function(err, docs){//toArray로 배열을 만들때 생기는 err, docs반환하는 콜백함수....ㅠ
        if(err){
            throw err;
            callback(err, null);//만든 함수를 보면 err, docs 를 반환함.
            return;
        }
        //docs 는 배열이므로 길이 체크 해야됨
        if(docs.length > 0){ 
            callback(null, docs);
        }else{//못찾은 경우
            callback(null, null);
        }
    });
}; 

router.route('/process/login').post(function(req, res){
    var id = req.body.id;
    var pw = req.body.pw;
    
    if (database){//db 연결 성공.
        authuser(database, id, pw, function(err, docs){//사용자가 만든 콜백 함수..!!! 공부 필요!!!!!
            if(err) throw err;
            
            if(docs){//만약 도큐먼트가 잇다면
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write("<h2>로그인 성공...</h2>");
                res.write("<h2>로그인 사용자: "+ docs[0].name + "</h2>");
                res.end();
            }else{//일치하는 사용자가 없는 경우
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write("<h2>로그인 실패...</h2>");
                res.write("<h2>id pw 재확인 필요...</h2>");
                res.write("<a href='/public/login.html'> 다시 로그인하기 </a>");
                res.end();
            }
        });//인증 함수 호출
    }else{//db연결 실패
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write("<h2>데이터베이스 연결 실패...</h2>");
        res.end();
    }
    
    var users = database.collection('users');//collection 은 table 같은 역할
    users.find({'id':id, 'password':pw}).toArray(function(err, docs){
        console.dir(docs);
        
        name = docs[0].name;
    });//필드명 id: 클라이언트 id   / 
    
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write("로그인 사용자: "+ name);
    res.end();
    
});