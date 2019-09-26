//Student 객체를 만들어 쥼
var Student = function(id, name, kor, eng){
    this.id = id;
    this.name = name;
    this.k = kor;
    this.e = eng;
    
    ///이렇게 하면 메모리 사용이 비효율적임
    //this.getName(function(){};) 
};

//prototype 선언을 통해 참조하는 형태로 메모리를 아낄 수 있음.
//선언은 아래 처럼 하지만, 실제로 사용할대는 Student.함수이름으로함
Student.prototype.getName = function(){
    return this.name;
};

//선언은 아래 처럼 하지만, 실제로 사용할대는 Student.함수이름으로함
Student.prototype.getAverage = function(){
    //외부 Student객체에 어떤 기능을 프로토타입 함수로 정의 하였기 때문에 this.k this.e 변수를 사용 가능함
    return (this.k + this.e)/2;
};

var j = new Student(11, 'jeong', 89, 23);//
console.log("%s의 평균 ", j.name, j.getAverage())