//객체를 만든 다음 explorts 하고 싶으면 사용

//calc객체를 만듬
var calc ={};
calc.add = function(a, b){
    return a + b;
};

//calc객체를 모듈로 만들겠다. 
module.exports = calc;