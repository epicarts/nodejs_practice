var fs = require('fs');

fs.open('./output.txt','w',function(err, fd){
    if(err) throw err; //상위에게 떠넘겨줌
    //var buf = new Buffer("hello\n");
    var buf = new Buffer("hello\r\n");// 메모장에 안뜸, 엔터 하나로 인식함.

    fs.write(fd, buf, 2, buf.length - 2, null, function(err, written, buffer){
        if(err) throw err;
        console.log(err, written, buffer);
        
        console.dir(buffer); // buffer 객체를 출력 하기 위해 dir 사용 
        
        fs.close(fd, function(){
            console.log("file write and")
        })
    });
});