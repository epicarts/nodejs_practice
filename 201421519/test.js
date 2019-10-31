var http = require('http');
var express = require('express');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var Character = require('./character');
var app = express();
var router = express.Router();
var router2 = express.Router();

router.route('/test1').get(function(req, res){
    var bu = req.query.sel;
    res.end(bu + 'test1');
});//여기서 다 끝남.

router.route('/test2').post(function(req, res){
    var bu = req.query.sel;
    res.end(bu + 'test2');
});//여기서 다 끝남.


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/public',static(path.join(__dirname, 'html')));

app.use('/', router);/// 라우터로 가라. 

http.createServer(app).listen(3300, function(){
    console.log("express server start......");
});