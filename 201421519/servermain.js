var http = require('http');
var express = require('express');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var Character = require('./character');
var app = express();
var ch;// 최대 10개로 만들 수 있다.
//var chlist = new Array(10);

//웹폴더 html 을 URL 은 public로 연결
app.use('/public',static(path.join(__dirname, 'html')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//답
app.use(function(req, res, next){
    var sel = req.body.sel || req.query.sel;
    if (sel == 'Create')
        res.redirect('/public/create.html');
    else if (sel == 'Add Item')
        res.redirect('/public/add.html');
    else if (sel == 'View'){
        res.write('<h1>Character Name:' + ch.name + '</h1>' );
        res.write('<h1>Character Level:'+ ch.level + '</h1>' );
        res.write('<h1>Item list:' + ch.item +'</h1>');
        res.write('<a href="/public/index.html">Main page</a>');
        res.end();
    }
    else
        next();
    
});

//app.use(function(req, res, next){
//    
//    var sel = req.query.sel;
//    var parname = req.body.inputN;
//    var parlevel = req.body.inputL;
//    
//    console.log(parname, parlevel);
//    if (sel == 'Create'){
//        res.redirect('/public/create.html');
//    };
//    
//    if (sel == 'Add Item'){
//        res.redirect('/public/add.html');
//    };
//    
//    if (sel == 'View'){
//        res.write('<h1>Character Name:</h1>' );
//        res.write('<h1>Character Level:</h1>' );
//        res.write('<h1>Item list:</h1>' );
//        res.end();
//        res.redirect('/');
//    };
//    next();
//});

//두번쨰 미들 웨어 작성
app.use('/', function(req, res, next){
    var menu = req.body.menu || req.query.menu;

    if(menu == "Create"){
        var na = req.body.inputN;
        var le = req.body.inputL;
        chlist.push(new Character(na, le)) //더이상 추가 할 수 없을떄 까지 create 가 10개 되면 추가 안됨.

        ch = new Character(na, le);
        
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write("Character "+ na + "us create");
        res.write('<a href="/public/index.html">Main page</a>')
    }
    else if(menu == "Add"){
        var additem = req.body.additem;
        var isExist = false;
        
        for (var i =0; i<ch.item.length; i++){
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

////두번쨰 미들 웨어 작성
//app.use(function(req, res, next){
//    var parname = req.body.inputN;
//    var parlevel = req.body.inputL;
//    
//    if (parname && parlevel){
//        console.log(parname, parlevel);
//        ch = new Character(parname, parlevel);
//    };
//    res.end();
//});



http.createServer(app).listen(3300, function(){
    console.log("express server start......");
});