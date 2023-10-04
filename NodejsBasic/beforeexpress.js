const http = require("http"); // http จะเป็นตัวจัดการเกี่ยวกับ req res ของผู้ใช้
const fs = require("fs"); // 5.เมื่อเราจะใช้ร่วมกับ html ก็ import ตัวนี้
const url = require("url"); // 7. ในตอนนี้มันมี product 1, 2, 3 ถ้าเราจะจะงาน query string ต้อง import ตัวนี้

// ถ้าใช้ readFileSync ด้านใน () เราจะทำการระบุตำแหน่งไฟล์ที่เราอยากจะใช้
// แต่ว่าในส่วนของ server ถ้าเราต้องการอยากจะอ้างอิงชื่อFolderหลัก เราจะใช้ dirname
// ${__dirname} เป็นการอ้างอิง folder ด้านนอกที่เราทำงานอยู่ ณ ตอนนี้
// 6. ทำการเรียกใช้ fs.readFileSync
const indexPage = fs.readFileSync(`${__dirname}/template/index.html`, 'utf-8')
const productPage1 = fs.readFileSync(`${__dirname}/template/product1.html`, 'utf-8')
const productPage2 = fs.readFileSync(`${__dirname}/template/product2.html`, 'utf-8')
const productPage3 = fs.readFileSync(`${__dirname}/template/product3.html`, 'utf-8')

//1. หลังจากที่ import http มาแล้วก็ให้สร้าง server
const server = http.createServer((req, res) => {
    // console.log(url.parse(req.url,true)) // เป็นการแสดงรายละเอียดตาม req ที่ส่งมา
    // 4. สร้าง path
    // update จาก 4. -> 8. เตรียมนำ pathName กับ query มาใช้ จากนั้นเปลี่ยนทุก path ให้เป็นตัวแปรตามที่เรา destruc มาเลย
    const { pathname, query } = url.parse(req.url,true)

//   console.log("dir = ", __dirname);
  // ในกรณีที่มี html มากกว่า 1 ตัว และ นอกจาก response ข้อความเราสามารถ response โดยใช้ตัวแปรได้
  if (pathname === "/" || pathname === "/home") {
    //3.เมื่อมีการส่ง req มาเราต้องการให้มัน res อะไร
    res.end(indexPage);  //โค้ดนี้เป็นการเขียนรวบ res.write res.end 
    //res.endเอาไว้บอกจุดสิ้นสุดระหว่างผู้ใช้และ server
  } else if (pathname === "/product") {
    // console.log(query.id) // 9. เช็คว่าเราพิมพ์ http://localhost:3000/product?id=1 มันขึ้นไอดีมาที่ terminal หรือไม่
    // เช็คแล้วมันมาแสดงว่าเรารับค่าที่ส่งมาพร้อมกับ url ได้เเล้ว
    // 10. เพิ่มข้อมูลสินค้า
    if(query.id === "1"){
        res.end(productPage1)
    } else if (query.id === "2"){
        res.end(productPage2)
    } else if (query.id === "3"){
        res.end(productPage3)
    } else {
        res.writeHead(404) // เขียน http status code เพื่อบอกสถานะ
        res.end("<h1>Not Found</h1>")
      }
  } else {
    res.writeHead(404) // เขียน http status code เพื่อบอกสถานะ
    res.end("<h1>Not Found</h1>")
  }
});

//2. สร้าง port ในการเชื่อมต่อ
server.listen(5000, "localhost", () => {
  console.log("start server in port 3000"); //หลังจาก start server แล้วให้ขึ้นข้อความนี้
});
