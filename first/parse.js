
var url = require('url'); // 이미 설치가 되어 있기 때문에 그냥 url 만 쓰면됨


//url.parse 는 물음표 이하를 쪼개주는 역할을 함. => curURL에 저장
var curURL = url.parse('https://search.naver.com/search.naver?sm=top_hty&fbm=0&ie=utf8&query=dasc');
console.dir(curURL); //dir은 객체 출력을 할 수 있음 
console.log("---------------------------------------------");
console.log(curURL.hostname);
console.log(curURL.query);
console.log("---------------------------------------------");


var curStr = url.format(curURL);
console.log("curStr은 ?  %s",  curStr);
console.log("---------------------------------------------")
//console.log(curURL);

console.log("---------------querystring------------------")

var querystring = require('querystring');//쿼리 스트링이라는 모듈 사용.

//쿼리 스트링 분리하기 query: 'sm=top_hty&fbm=0&ie=utf8&query=dasc',
var data = querystring.parse(curURL.query); //쿼리 부분만 파싱!!
console.log(data);
console.log(data.sm);
console.log(data.fbm);

