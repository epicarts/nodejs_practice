var http = require('http');
var fs = require('fs');
var instream = fs.createReadStream('./first/lion.png', {flags:'r'});
var server = http.createServer(function(req, res){//서버를 만듬
   instream.pipe(res); //서버요청이 오면 pipe로 instream 으로 연결 ( 즉 사진 으로 연결)
});

server.listen(3000);