var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Character = function(name, level){
    this.name = name;
    this.level = level;
    this.item = new Array();
    
};
util.inherits(Character, EventEmitter);

//프로토 타입 함수. 이벤트 작성법. 
Character.prototype.on('addItem', function(item){
    this.item.push(item); // push 함수를 이용해 집어 넣음.
});
//5명의 캐릭터를 생성 했으면, B 아이템. => 
//addItem 입력 받는 add페이지에 아이템을 바꿔야함.
//View 캐릭터 마다 다 볼 수 있게. 반복문으로 처리...


module.exports = Character; // 모듈 내보내기.

//var Character = function(name, level){
//    var self = this;
//    this.item = new Array(); //처음 생성시에만 변수 선언
//    this.name = name;
//    this.level = level;
//    
//    this.on('addItem',function(){// 이벤트 발생시 item 을 변경
//        this.item = item; // 
//
//    });
//}
//
////function Character(item)
//////    this.name = name;
//////    this.level = level;
////
//////    this.item = new Array(); //함수 생성시 변수 초기화 ..? 되려나
////    
////    this.on('addItem',function(){// 이벤트 발생시 item 을 변경
////        this.item = item; // 
////
////    });
////};
////
////
////
//Character.prototype.addItem = function(name, level){
//    
//}// 사용법 Character.??(값 전달.)
//
//
//util.inherits(Character, EventEmitter);
//module.exports = Character; // 모듈 내보내기.