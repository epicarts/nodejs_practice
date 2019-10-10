var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Calc = function(){//생성자 함수
   this.on('add2', function(a, b){
       console.log("a + b = %d", a + b);
   }); // on = function('add2', function(){} );
}; 

Calc.prototype.add = function(a, b){
    return a + b;
};

util.inherits(Calc, EventEmitter); //Cacl 이 EventEmitter로부터 상속 받음 

Calc.prototype.on = function('add_pro', function(a, b){//이벤트 처리기를 프로토 타입으로 만들고.
    //  이벤트값,  함수 
    console.log("a+b = %d", a+b);
};);


module.explot = Calc;