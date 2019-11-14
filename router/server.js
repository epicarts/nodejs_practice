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

/////create
var app = express();


///middleware
app.use(bodyParser.urlencoded({extended:false}));//html
app.use(bodyParser.json());//json

app.use(cookieParser());// cookie-parser 설정
app.use(session({
    secret: 'my key',
    resave: 'true',
    saveUninitialized:true 
})); // session 객체 등록 ** 생성할때 전달인자 필요.


app.use('/uploads', static(path.join(__dirname, 'uploads')))
app.use('/public', static(path.join(__dirname, 'html')));

//cors/////////////////////////
app.use(cors());
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads')//uploads 라는 폴더에 저장 할 수 있음.
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname + Date.now())
    }
});

var upload = multer({ 
    storage: storage,
    limits: {
        files: 10,
        fileSize: 1024 * 1024 * 1024
    }
});
//cors/////////////////////////




////////////////////////라우터 router /////////////////////////
var router = express.Router();

app.use('/process',router);
//function
router.route('/login').post(function(req, res){
    var id = req.body.id; // post 방식이기 때문에 body에 위치, from id 이름
    var pw = req.body.pw;
    //세션이 있을경우
    if(req.session.user){
        res.redirect('/public/product.html');
    }
    else{//세션이 없을 경우... 세션 생성.
        req.session.user = {
            id: id,
            pw: pw,
            name: 'namenaem',
            etc: 'etc...',
            saveUninitialized: true
        };
    }

    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'})
    res.write("ID" + id);
    res.write("PW" + pw);
    res.write('로그인 성공');
    res.write('<a href="/process/product">상품페이지로 이동</a>');
    res.end();
});


//router.route('/login').get(function(req, res){
//    var id = req.query.id;
//    var pw = req.query.pw;
//    
//    //세션이 있을경우
//    if(req.sessions.user){
//        res.redirect('/public/product.html');
//    }
//    else{//세션이 없을 경우... 세션 생성.
//        req.sessions.user = {
//            id: id,
//            pw: pw,
//            name: 'namenaem',
//            etc: 'etc...',
//            saveUninitialized: true
//        };
//    }
//
//    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'})
//    res.write("ID" + id);
//    res.write("PW" + pw);
//    res.write('get 방식 로그인 성공');
//    res.write("<a herf='/process/product'>상품페이지로 이동</a>")
//    res.end();
//});


////////////////쿠키//////////////
//웹브라우저에 쿠키 저장 하는 기능.
router.route('/setUserCookie').get(function(req, res){
    console.log('/process/setUserCookie 호출됨');
    
    //웹 브라우저에 저장이 됨.
    res.cookie("User", {
        id: "jeong",
        pw: 1234,
        name: 'seungdo',
        authorized: true,//이건 정의가 되어 있음 authorized
    });//이름, json 규격으로 내용이 들어감
    res.cookie("info",{
        name: "abc",
        co:"smu",
        authorized: true
    });
    res.redirect('/process/showCookies');
});

//쿠키를 가져와서 화면에 보여줌
router.route('/showCookies').get(function(req, res){
    console.log('process/showCookies 호출 됨..');
    console.dir(req.cookies);
    res.send(req.cookies);
});

///////////////세션//////////////////
router.route('/product').get(function(req, res){
    if(req.session.user){//세션에 유저 세션 존재 확인
        res.redirect('/public/product.html');
    }
    else{
        res.redirect('/public/login.html');
    }
});

router.route('/logout').get(function(req, res){
    if(req.session.user){
        console.log('logout');
        req.session.destroy(function(err){
            if(err) throw err;
        }); // 세션을 지우는 함수
    }
    else{
        res.redirect('/public/login.html');
    }
});


//////사진 업로드////// upload.array('photo', 1)=> 올라오는 파일을 묶어서 배열로 처리
router.route('/photo').post(upload.array('photo', 1), function(req, res){
    console.log('/process/photo 호출.');
    try {
        var files = req.files;

        console.dir('#===== 업로드된 첫번째 파일 정보 =====#')
        console.dir(req.files[0]);
        console.dir('#=====#')
        
        // 현재의 파일 정보를 저장할 변수 선언
        var originalname = '',
            filename = '',
            mimetype = '',
            size = 0;

        if (Array.isArray(files)) {   
            // 배열에 들어가 있는 경우 (설정에서 1개의 파일도 배열에 넣게 했음)
            console.log("배열에 들어있는 파일 갯수 : %d", files.length);
            
        for (var index = 0; index < files.length; index++) {
                originalname = files[index].originalname;
                filename = files[index].filename;
                mimetype = files[index].mimetype;
                size = files[index].size;
            }

        } else {   // 배열에 들어가 있지 않은 경우 (현재 설정에서는 해당 없음)
            console.log("파일 갯수 : 1 ");

            originalname = files[index].originalname;
            filename = files[index].name;
            mimetype = files[index].mimetype;
            size = files[index].size;
        }
        console.log('현재 파일 정보 : ' + originalname + ', ' + filename + 
                        ', ' + mimetype + ', ' + size);
        res.end();
    }//try
    catch(err){
        console.dir(err.stack);
    }
});



//serverstart
http.createServer(app).listen(3300, function(){
    console.log("express server start......");
});