var Calc = require('./Calculator_module');

var j = new Calc(11, 242);

console.log('덧셈 결과:' + j.add());
console.log('나누기 결과:' + j.div());
console.log('곱셈 결과:'+ j.mul());
console.log('뺄셈 결과:' + j.sub());


console.log("=====================");

j.emit('add');//이벤트 발생
j.emit('div');//이벤트 발생
j.emit('mul');//이벤트 발생
j.emit('sub');//이벤트 발생