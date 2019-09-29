//student.js 파일을 가져옴
var stud = require('./student');// 내가 만든 파일이므로 꼭 경로를 붙여주어야함

var j = new stud(11, 'jeong', 354, 242);

console.log(j.getAverage());

j.emit('name');//이벤트 발생

//더사칙 연산 cal2 를 ㅣㅇ요해서 
//function 방식과 이벤트 방식이 다 가능하도록 만들면됨. 이벤트 방삭과 function 방식이 가능하도록 만들어주면됨.

//이번 숙제는 a, b를 받고 
var Calc = function (a,b){
    this.a = a;
    this.b = b;
    
};


//add 이벤트 발생 더해줘요 on 함수 add 더하기 기능 on multi 곱하기 총 5개의 이벤트처리기 를 만들어야됨
// 예를 불러다가 쓰는 예제 코드가지 

//더하기 빼기는  on 함수를 이용해서 add 를 이요해서 
Calc.prototype.add = function(a, b){
    return a + b;
};

module.exports = Calc;

//이번 숙제는 a, b를 받고 
//더사칙 연산 cal2 를 ㅣㅇ요해서 
//function 방식과 이벤트 방식이 다 가능하도록 만들면됨. 이벤트 방삭과 function 방식이 가능하도록 만들어주면됨.

//add 이벤트 발생 더해줘요 on 함수 add 더하기 기능 on multi 곱하기 총 5개의 이벤트처리기 를 만들어야됨
// 예를 불러다가 쓰는 예제 코드가지 

//더하기 빼기는  on 함수를 이용해서 add 를 이요해서 