console.log("first bracket");

var result = 0;

console.time('duration_sum');
for (var i=1; i<= 100000; i++){
    result += i;
}

console.timeEnd('duration_sum');
console.log("1~ 100까지 모두 더함: %d", result);

console.log("현재 실행한 파일의 이름: %s",__filename);
console.log("현재 실행한 파일의 이름: %s",__dirname);


//여기에 씌여진 모듈명을 가져옴
var calc = require("./calc");

console.log("결과: %d", calc.add(10, 40));
console.log("결과: %d", calc.multi(10, 40));


//calc2.js에서 가져옴
var calc = require("./calc2");

console.log("결과: %d", calc.add(10, 40));

//경로를 안쓰고 패키지 명만 쓰면 알아서 해줌
var nconf = require("nconf");

//express 
var ex = require('express');
nconf.env();
console.log('OS 환경변수의 값: %s', nconf.get('OS'));




var os = require('os');
console.log('시스템의 hostname : %s', os.hostname());
console.log('시스템의 메모리 : %d / %d', os.freemem(), os.totalmem());
console.log('시스템의 CPU 정보\n');
console.dir(os.cpus());
console.log('시스템의 네트워크 인터페이스 정보\n');
console.dir(os.networkInterfaces());



//경로 관리 할 때 쓰는 모듈
var path = require('path');

// 디렉터리 이름 합치기
var directories = ["users", "mike", "docs"];
var docsDirectory = directories.join(path.sep);
console.log('문서 디렉터리 : %s', docsDirectory);

// 디렉터리 이름과 파일 이름 합치기
var curPath = path.join('/Users/mike', 'notepad.exe');
console.log('파일 패스 : %s', curPath);

