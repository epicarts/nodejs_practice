var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Calculator = function(a, b, kor, eng){
    this.a = a;
    this.b = b;

    //이벤트가 발생 처리
    this.on('add', function(){
        console.log("덧셈 결과: %f", (this.a + this.b));
    });
    
    this.on('div', function(){
        console.log("나누기 결과: %f", (this.a / this.b));
    });

    this.on('mul', function(){
        console.log("곱셈 결과: %f", (this.a * this.b));
    });

    this.on('sub', function(){
        console.log("뺄셈 결과: %f", (this.a - this.b));
    });

};

//더하기
Calculator.prototype.add = function(){
    return (this.a + this.b);
};

//나누기
Calculator.prototype.div = function(){
    return (this.a / this.b);
};

//곱하기
Calculator.prototype.mul = function(){
    return (this.a * this.b);
};

// 뺄셈
Calculator.prototype.sub = function(){
    return (this.a - this.b);
};

util.inherits(Calculator, EventEmitter);
module.exports = Calculator;