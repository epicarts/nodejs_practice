var http = require('http');
var express = require('express');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var Character = require('./character');
var app = express();
var ch;// 최대 10개로 만들 수 있다.
var chlist = new Array(10);

//웹폴더 html 을 URL 은 public로 연결
app.use('/public',static(path.join(__dirname, 'html')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//첫번째 미들 웨어
app.use(function(req, res, next){
    var sel = req.body.sel || req.query.sel;
    
    if (sel == 'Create')
        res.redirect('/public/create.html');
    else if (sel == 'Add Item')
        res.redirect('/public/add.html');
    else if (sel == 'View'){
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>Character Name:' + ch.name + '</h2>' );
        res.write('<h2>Character Level:'+ ch.level + '</h2>' );
        res.write('<h2>Item list:' + ch.item +'</h2>');
        res.write('<a href="/public/index.html">Main page</a>');
        res.end();
    }
    else
        next();
    
});

//두번쨰 미들 웨어 작성
app.use('/', function(req, res, next){
    var menu = req.body.menu || req.query.menu;

    if(menu == "Create"){ //create.html
        var na = req.body.inputN;
        var le = req.body.inputL;
        chlist.push(new Character(na, le)) //더이상 추가 할 수 없을때 까지 create 가 10개 되면 추가 안됨.

        ch = new Character(na, le);
        
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write("Character "+ na + " is created</br>");
        res.write('<a href="/public/index.html">Main page</a>');
    }
    else if(menu == "Add"){ // add.html 
        var additem = req.body.additem;
        
        var isExist = false;//이미 존재하는지 검사
        for (var i =0; i < ch.item.length; i++){
            if(additem == ch.item[i])
                isExist = true;
        }
        if(isExist){
            res.write('<h1>아이템이 존재 한다. Item: ' + additem + '</h1>');
        }
        else{
            ch.emit('addItem', additem);
            res.write('<h1>Item: ' + additem + '</h1>' );
        }
    }
    res.end();
});

http.createServer(app).listen(3300, function(){
    console.log("express server start......");
});