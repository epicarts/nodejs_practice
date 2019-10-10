var winston = require('winston');    // 로그 처리 모듈
var winstonDaily = require('winston-daily-rotate-file');    
                            // 로그 일별 처리 모듈
var moment = require('moment');    // 시간 처리 모듈

function timeStampFormat() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ'); 
    // '2016-05-01 20:14:28.500 +0900'
};

//winston.Logger 구책
var logger = winston.createLogger({
    transports: [
        new (winstonDaily)({
            name: 'info-file',
            filename: './log/server-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: 'info',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        }),
        new (winston.transports.Console)({
            name: 'debug-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ],
exceptionHandlers: [
        new (winstonDaily)({
            name: 'exception-file',
            filename: './log/exception-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: 'error',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        }),
        new (winston.transports.Console)({
            name: 'exception-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ]
});

module.exports = logger; // logger 모듈을 필요할때 사용할 수 있게 모듈로 사용
