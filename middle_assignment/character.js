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
module.exports = Character; // 모듈 내보내기.