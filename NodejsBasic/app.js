const express = require('express');
const path = require('path'); 
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express(); 
const router = require('./routes/myrouter') 

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(cookieParser())
// 1.เรียกใช้งาน session 
app.use(session({
    secret: "mysession",
    resave: false,
    saveUninitialized: false
}))
// ก่อนที่จะเรียกใช้ router
// โค้ดนี้เป็นการบอกว่าเราทำการส่งข้อมูลจาก form มาในรูปแบบ post 
// เเละส่งมาที่ router ที่เราได้ทำการนิยามและให้ url ทำการ encoded เพื่อที่จะได้ข้อมูลที่ส่งมาเอามาใช้งาน
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))
app.use(router)



app.listen(3000, () => {
    console.log("Start server 3000")
})