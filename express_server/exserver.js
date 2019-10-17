//npm init
//npm install express --save
//npm install serve-static --save 
//npm install body-parser --save
var http = require('http');
var express = require('express');//module 불러옴
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var app = express(); //익스프레스 객체 생성.

//path.join 테스
console.log(path.join(__dirname));
console.log(path.join(__dirname, 'html'));

app.set('PORT',3000);//저장 역할을 함 key,value 인듯 ..?

//html
app.use(bodyParser.urlencoded({extended: false}));//bodyParser등록

//json
app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'html')));//express 객체의 미들 웨어로 등록
//static 절대경로 d:\server\html ..이렇게 사용 가능.
//public URL 사용. 경로 /public 로 URL 접근ㅇ르 하면 html 폴더로 접근이 됨.

app.use(function(req, res, next){//파라미터: req, res, next 가 추가 됨.

    //post 방식 || get 방식을 나눔 ...
    var pid = req.body.id || req.query.id;
    var ppass = req.body.pass || req.query.pass;
    
    
    console.log(pid, ppass);
    res.write("<h1>ID: " + pid + "</h1>");
    res.write("<h1>password: " + ppass + "</h1>");
    res.end();
    
    //res.write("<h1>hello</h1>");
    //res.redirect('http://google.com')
    //res.redirect('public/index.html')

    req.login = "not ok";// 변수 생성
    //res.end();//엔드는 제일 마지막에 끝내는 의미로 써야됨.
    //next();
});//클라이언트 접속을 하면 use 에서 처리함. 미들웨어

//
//app.use('/', function(req, res, next){//두번째 부터 경로를 만들어줌 .. 왜지..? 일단 파라미터는 같음.
//    if(req.login == 'ok')//변수가 전달이 됨.
//        res.write("hello user");
//    res.end();
//});




//var server = http.createServer(app); // express 서버 생성
http.createServer(app).listen(app.get('PORT'),function(){// 파라미터: 포트, 콜백함수
    console.log("express web server start!!!"); // 정상적으로 실행 됫는지 콘솔 로그로 확인하기.
});




//다 하고 난다음 app 를 이용해서 서버를 클릭.