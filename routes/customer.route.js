const express = require("express");
const router = express.Router();
const multer =  require('multer');
const upload = multer({dest: './public/uploads/'});

const controller = require("../controllers/customer.controller");
const validate = require("../validate/user.validate");

router.get("/", controller.index);

router.get("/search", controller.search);

router.get("/create", controller.getCreate);

router.post("/create", upload.single('avatar'), controller.create);

router.get("/:_id", controller.getCustomer);

router.get("/update/:_id", controller.getUpdateCustomer);

router.post("/update/:_id", upload.single('avatar'), controller.updateCustomer);

router.post("/delete/:_id", controller.delete);

module.exports = router;
