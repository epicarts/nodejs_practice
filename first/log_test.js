var logger = require('./logger');// 내가 만든 파일이므로 꼭 경로를 붙여주어야함

var fs = require('fs');

var inname = './output.txt';
var outname = './output2.txt';

fs.exists(outname, function (exists) {
    if (exists) {
        fs.unlink(outname, function (err) {
            if (err) throw err;
            logger.info('기존 파일 [' + outname +'] 삭제함.');//로그 파일이 남게됨
            //loger.info 안에 내가 쓰고 싶은 문자열을 넣으면 됨.
        });
    }
    
    var infile = fs.createReadStream(inname, {flags: 'r'} );//output.txt 를 읽고
    var outfile = fs.createWriteStream(outname, {flags: 'w'});//output2.txt 파일을 쓸거임

    //infile에 연결된 파일(output.txt , read)을 outfile(output2.txt, write)로 연결 
    infile.pipe(outfile);//output.txt 를 outut 2 로 연결 
    logger.info('파일 복사 [' + inname + '] -> [' + outname + ']');
});

logger.info('로그 넘기기'+1234+2222);