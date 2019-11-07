app.use('/', router) // 지정된 것 만 사용
//모든 경로에 대해서는 route가 처리

app.use('/process', r) // 
r.route('login').get or post

'/process/login'  <-- 실제로 들어가는 경로

app.use('/user', router2)
// user 경로가 들어 간 것에 대해서는 router2가 처리