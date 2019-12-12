var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function (mongoose){
    
    // 스키마 정의
    UserSchema = mongoose.Schema({
        id: {type: String, required: true, unique: true},   
        hashed_password : {type : String, required : true, 'default' : ' '},
        salt : {type : String, required : true},        
        name: {type: String, index: 'hashed', 'default':''},
        age: {type: Number, 'default': -1},
        created_at : {type : Date, index : {unique : false}, 'default' : Date.now},
        updated_at : {type : Date, index : {unique : false}, 'default' : Date.now}
    });
    
    // info를 virtual 메소드로 정의
    UserSchema
        .virtual('password')
        .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
        console.log('virtual password 호출됨 : ' + this.hashed_password);
    })
    .get(function() {return this._password});

        
    UserSchema.static('findById', function(id, callback) {
        return this.find({id : id}, callback);
    });//데이터 베이스 전체를 가져옴 static
    
    UserSchema.static('findAll', function(callback) {
        return this.find({ }, callback);
    });
    
    UserSchema.method('encryptPassword', function(plainText, inSalt) {// 일부 사용자만 가져옴. method
        if(inSalt) {
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
        } else {
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
        }
    });
    
    // salt 값 만들기 메소드
    UserSchema.method('makeSalt', function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    });

    // 인증 메소드 - 입력된 비밀번호와 비교 (true/false 리턴)
    UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
        if(inSalt) {
            console.log('authenticate 호출됨 : %s -> %s : %s', plainText, 
                        this.encryptPassword(plainText, inSalt), hashed_password);
            return this.encryptPassword(plainText, inSalt) === hashed_password;
        } else {
            console.log('authenticate 호출됨 : %s -> %s : %s', plainText, 
                        this.encryptPassword(plainText), this.hashed_password);
            return this.encryptPassword(plainText) === this.hashed_password;
        }
    });
    
    // 필수 속성에 대한 유효성 확인 (길이 값 체크)
    UserSchema.path('id').validate(function(id) {//id가 있으면 가서 길이가 있으면 반환댐
        return id.length;
    }, 'id 칼럼의 값이 없습니다.');
    
    UserSchema.path('name').validate(function(name) {
        return name.length;
    }, 'name 칼럼의 값이 없습니다.');
    
    
    console.log('UserSchema 정의함.');
    
    return UserSchema;
}

module.exports = Schema;

