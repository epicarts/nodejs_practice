////이벤트 기능을 사용하기 위해서는 상속부터 .. 받아야댐
//var util =require('util'); //이 친구 덕분에 상속을 받을 수 있음.
//var Eventemitter = require('event').EventEmitter;
//
//
////Student 객체를 만들어 쥼
//var Student = function(id, name, kor, eng){
//    this.id = id;
//    this.name = name;
//    this.k = kor;
//    this.e = eng;
//    
//    this.on('name', 
//        function(){
//        setTimeout(function(){
//            console.log('asdasd ');
//                },30000);
//            console.log("my name is %s \n", this.name);
//        });
//    
//    //이벤트 에미터에 정의되어 있는 리스너 on을 사용함.
//    //(이벤트 명, 콜백함수)
//    this.on('name', 
//    function(){
//        console.log("my name is %s \n", this.name);
//    });
//};
//
////prototype 선언을 통해 참조하는 형태로 메모리를 아낄 수 있음.
////선언은 아래 처럼 하지만, 실제로 사용할대는 Student.함수이름으로함
//Student.prototype.getName = function(){
//    return this.name;
//};
//
////선언은 아래 처럼 하지만, 실제로 사용할대는 Student.함수이름으로함
//Student.prototype.getAverage = function(){
//    //외부 Student객체에 어떤 기능을 프로토타입 함수로 정의 하였기 때문에 this.k this.e 변수를 사용 가능함
//    return (this.k + this.e)/2;
//};
//
////util을 사용해서 Eventemitter를 상속 받을 수 있음
//util.inherits(Student, Eventemitter);
//
//
//module.exports = Student; // 외부로 익스포트 가능
//module.exports.title = 'student';// 별도의 이름을 만들어서 익스포트 가능 

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Student = function(id, name, kor, eng){
    this.id = id;           this.name = name;
    this.k = kor;           this.e = eng;
    this.on('name', function(){
        setTimeout(function(){
            console.log("timer end \n")
        }, 3000);
        console.log("my name is %s \n", this.name);
    });
   
   
};
Student.prototype.getName = function(){
    return this.name;  
};
Student.prototype.getAverage = function(){
    return (this.k = this.e)/2;  
};

util.inherits(Student, EventEmitter);

/*var j = new student(11, 'jeong', 89, 23);

console.log("%s의 평균은 %\n", j.name, j.getAverage());*/

module.exports = Student;
module.exports.title = 'Student';