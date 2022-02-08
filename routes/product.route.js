const express = require("express");
const router = express.Router();
const multer =  require('multer');
const upload = multer({dest: './public/uploads/'});

const controller = require("../controllers/product.controller");

router.get("/", controller.index);

router.get("/search", controller.search);

router.get("/create", controller.getCreate);

router.post("/create", upload.single('image'), controller.create);

router.get("/:_id", controller.getProduct);

router.get("/update/:_id", controller.getUpdateProduct);

router.post("/update/:_id", upload.single('image'), controller.updateProduct);

router.post("/delete/:_id", controller.delete);

module.exports = router;
