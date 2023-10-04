const express = require("express");
const router = express.Router();
const path = require("path");
const Product = require("../models/products");
const multer = require("multer");
const mongoose = require("mongoose");

// เตรียมไฟล์ก่อน upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/products");
  },
  filename: function (req, file, cb) {
    // cb(null,ชื่อที่ต้องการแต่เราเอาเวลามาตั้งชื่อจะได้ไม่ซ้ำ+นามสกุลที่ต้องการ)
    cb(null, Date.now() + ".jpg");
  },
});

// เริ่มต้นกระบวนการ upload
const upload = multer({
  storage,
  // เมื่อเขียนเสร็จแล้วเราจะเอาตัว upload ไปผูกกับ router.post
});

// ตรงนี้เป็นส่วนที่เอาไว้แสดงผลข้อมูล
router.get("/", (req, res) => {

  Product.find()
    .then((doc) => {
      res.render("index", { products: doc });
    })
    .catch((err) => {
      console.log(err);
    });
});


router.get("/add-product", (req, res) => {

  if (req.session.login) {
    // ถ้าหากแอดมินลอคอินเข้าสู่ระบบแล้ว
    res.render("form");
  } else {
    res.render("admin");
  }
});

// แก้ในส่วน manage ด้วย
router.get("/manage", (req, res) => {
  // 3. เปลี่ยน cookie ให้เป็น session
  if (req.session.login) {
    Product.find()
      .then((doc) => {
        res.render("manage", { products: doc });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.render("admin");
  }
  // แสดงข้อมูลใน session
  // console.log("รหัส session =", req.sessionID)
  // console.log("ข้อมูลใน session =", req.session)
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/manage");
  });
});

// เพิ่ม path delete/ตามด้วยidที่ส่งมา ต้องเขียนแบบนี้
router.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  // Validate if the id parameter is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send("Invalid ID");
    return;
  }
  // console.log(req.params.id) เอาไว้เช็คว่าไอดีมันส่งมารึป่าว
  Product.findByIdAndDelete(id, { useFindAndModify: false })
    .then(() => {
      res.redirect("/manage");
    })
    .catch((err) => console.log(err));
});


router.get("/:id", (req, res) => {
  // ตอนนี้เราสามารถดึงไอดีมาได้แล้วเราจะให้ id มาสอบถามข้อมูลอีกที
  const product_id = req.params.id;
    
  Product.findOne({ _id: product_id })
    .then((doc) => {
      console.log(doc);
      // ให้มัน render product.ejs พร้อมกับส่งข้อมูล product เป็นชื่อ ที่เก็บ doc(ที่เราไปค้นมา) เอาไว้
      // แล้วเราจะเอา product ที่เก็บ doc เอาไว้เนี่ยไปทำงานที่ product.ejs
      res.render("product", { product: doc });
    })
    .catch((err) => console.log(err));
});

// นำ upload มาใช้ร่วมกับ router.post เพื่อที่จะรับเอาข้อมูลไฟล์ที่ upload จาก form เข้ามาใช้งาน
router.post("/insert", upload.single("image"), (req, res) => {
  // นำค่าที่ส่งมามาเก็บลงใน db ที่มี collection ที่มีชื่อว่า products โดยให้ model Product เป็นตัวดำเนินการ
  // คำสั่งนี้เหมือนกับการ generate id เพิ่มขึ้นมาใหม่
  let data = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.file ? req.file.filename : '',
    description: req.body.description,
  });

  Product.create(data)
    .then((savedProduct) => {
      console.log("Product saved:", savedProduct);

      res.redirect("/");
    })
    .catch((err) => {
      console.error("Error saving product:", err);
      res.redirect("/");
    });
});


router.post("/edit", (req, res) => {

  const edit_id = req.body.edit_id;

  Product.findOne({ _id: edit_id })
    .then((doc) => {
      console.log(doc);

      res.render("edit", { product: doc });
    })
    .catch((err) => console.log(err));
});

// เขียน router สำหรับการ update
router.post("/update", (req, res) => {
    // console.log(req.body.update_id)
  const update_id = req.body.update_id;
  let data = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
  };

  Product.findByIdAndUpdate(update_id, data, { useFindAndModify: false })
    .then(() => {
      // หลังจากบันทึกแล้วให้ไปหน้า manage
      res.redirect("/manage");
    })
    .catch((err) => {
      console.error("Error saving product:", err);
      res.redirect("/manage");
    });
});


router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const timeExpire = 300000; // 1000 = 1 sec
  if (username === "admin" && password === "123") {
    req.session.username = username;
    req.session.password = password;
    req.session.login = true;
    req.session.cookie.maxAge = timeExpire;
    res.redirect("/manage");
  } else {
    res.status(404);
    res.render("404");
  }
});

module.exports = router;
