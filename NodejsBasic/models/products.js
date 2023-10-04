// ไฟล์นี้เอาไว้ทำการเชื่อมกับฐานข้อมูล รวมไปถึงการออกแบบ schema และการสร้าง model ขึ้นมาใช้
// 1.ใช้งาน mongoose
const mongoose = require('mongoose')

// 2. connect to MongoDB
// การเชื่อมไปยัง MongoDb เราต้องใช้ database url
// mongodb://localhost:27017/ไฟล์ที่เราอยากสร้างและจัดเก็บข้อมูลเอาไว้
const dbUrl = 'mongodb://127.0.0.1:27017/productDB'
// mongoose.connect(dburl,option ที่เอาไว้ตั้งค่าตัว mongoose ให้เชื่อมกับ MongoDB)
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(() => console.log('Connect'))
.catch((err) => { console.error(err);});


// 3. เมื่อมีการเชื่อมแล้วก็ออกแบบ schema / โครงสร้างในการจัดเก็บข้อมูล
let productSchema = mongoose.Schema({
    name:String,
    price:Number,
    image:String,
    description:String
})

// 4. สร้าง model | model ในตอนนี้ = Product
// เมื่อออกแบบเสร็จเรียบร้อยเราก็จะนำ productSchema มาสร้างเป็น model
// mongoose.model("collectionName ที่เราจะสร้างขึ้นมา", โครงสร้างในการจัดเก็บข้อมูล)
// let Product ที่ใช้ตัวพิมพ์ใหญ่เพื่อบอกว่าส่วนที่เป็น model เป็นการสร้าง class ขึ้นมา
let Product = mongoose.model("products",productSchema)

// 5. export model
// เป็นการ export ส่วนที่เป็น class module
// model Product ไปเชื่อมโยงกับ collection ที่มีชื่อว่า products
// model = ตัวแทน collection
module.exports = Product

// 7. built saveable function ที่มีชื่อว่า saveProduct = function(โมเดลที่เราอยากจะทำงาน,data หรือ doc ที่ส่งเข้ามา) doc คือข้อมูลที่เก็บใน collection
module.exports.saveProduct = function(model,data){
    model.save(data) //ให้ model บันทึกข้อมูลที่ส่งเข้ามา
}















