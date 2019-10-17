//npm init
//npm install express --save
var http = require('http');
var express = require('express');//module 불러옴

var app = express(); //익스프레스 객체 생성.
app.set('PORT',3000);//저장 역할을 함 key,value 인듯 ..?

app.use(function(req, res, next){//파라미터: req, res, next 가 추가 됨.
    res.write("<h1>hello</h1>");
    //res.end();//엔드는 제일 마지막에 끝내는 의미로 써야됨.
    next();
});//클라이언트 접속을 하면 use 에서 처리함. 미들웨어


app.use('/', function(req, res, next){//두번째 부터 경로를 만들어줌 .. 왜지..? 일단 파라미터는 같음.
    res.end();
});

//var server = http.createServer(app); // express 서버 생성
http.createServer(app).listen(app.get('PORT'),function(){// 파라미터: 포트, 콜백함수
    console.log("express web server start!!!"); // 정상적으로 실행 됫는지 콘솔 로그로 확인하기.
});




//다 하고 난다음 app 를 이용해서 서버를 클릭.