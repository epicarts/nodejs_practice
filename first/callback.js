//콜백 함수: 함수의 전달인자로 들어가는 함수
var scard = function(rank, print){ //(인자값, 콜백 함수 이름)
    //db, array -> rank :1, jeong, 90 
    //rank 5번 을 넣으면 print 하는 함수 
    print(1, 'jeong', 90);
    //원래는 함수 내부를 바꿀수 없음. 물론 가능은 함 
    // 내가 원하면 수정을 할 수 있음. 
    
}; 
scard(1)

scard(5, function(a, b, c){
    // 전달인자가 3개인 이유는 출령해야 할 게 (학번, 이름, 랭크) 이렇게 총 3개 이기 때문
    console.log("n: %s, no: %d, score: %d", b, a, c);
});

scard(7, function(a, b, c){
    // 전달인자가 3개인 이유는 출령해야 할 게 (학번, 이름, 랭크) 이렇게 총 3개 이기 때문
    console.log("no: %d, name: %s, score: %d", a, b, c);
});