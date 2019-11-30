var http = require('http');
var express = require('express');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var Character = require('./character');
var app = express();
var chlist = new Array(); //배열을 담을 수 있는 chlist 생성

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
        for (var i =0; i < chlist.length; i++){
            res.write('<h5>Character Name:' + chlist[i].name + '</h5>' );
            res.write('Character Level:'+ chlist[i].level + '</br>' );
            res.write('Item list:' + chlist[i].item +'</br>');
        }
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
        var name = req.body.inputN;
        var level = req.body.inputL;
        
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});

        var name_isExist = false;//이름이 존재하는지 검사
        var max_size = false;//사이즈가 초과되는지 검사
        
        //name_isExist
        for (var i =0; i < chlist.length; i++){
            if(name == chlist[i].name)
                name_isExist = true;
        }
        //이름 중복시
        if (name_isExist)
            res.write("sorry. "+name+" is Exist.</br> ");
        
        //size_check
        if (chlist.length >= 10)
            max_size = true;
        
        if (max_size)
            res.write("sorry. Character is max.</br> ");
        
        if (max_size == true || name_isExist == true){
             res.write(name + " is not created</br>");
        }
        
        if (max_size == false && name_isExist == false){
            chlist.push(new Character(name, level)); 
            res.write("Character "+ name + " is created</br>");
        }
    }
    else if(menu == "Add"){ // add.html
        var additem = req.body.additem;
        var charactername = req.body.charactername;
        
        var itme_isExist = false;//아이템 존재 검사
        var name_isExist = false;//이름 존재 검사
        for (var i=0; i<chlist.length; i++){
            if (charactername == chlist[i].name){
                name_isExist = true;//이름이 있음.
                for (var j =0; j < chlist[i].item.length; j++){
                    if(additem == chlist[i].item[j])
                        itme_isExist = true;
                }
                break;
            }
        }
        
        //이름 존재, 아이템 중복이 없으면.. => 저장
        if(name_isExist == true && itme_isExist ==false){
            chlist[i].emit('addItem', additem);
            res.write('<h1>success! Item: ' + additem + '</h1>' );
        }
        //나머지는 저장 불가.        
        else{
            res.write('<h1>sorry. Fail to addItme . Item: ' + additem + '</h1>');
            res.write('<h1>name: ' + charactername + '</h1>');
            res.write('<h1>Item: ' + additem + '</h1>');
        }
    }
    res.write('<a href="/public/index.html">Main page</a>');
    res.end();
});

http.createServer(app).listen(3300, function(){
    console.log("express server start......");
});