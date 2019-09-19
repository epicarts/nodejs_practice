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