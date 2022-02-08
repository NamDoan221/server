const express = require("express");
const router = express.Router();

const controller = require("../controllers/employee.controller");
const validate = require("../validate/user.validate");

router.get("/", controller.index);

router.get("/search", controller.search);

router.get("/create", controller.getCreate);

router.post("/create", controller.create);

router.get("/:_id", controller.getEmployee);

router.get("/update/:_id", controller.getUpdateEmployee);

router.post("/update/:_id", controller.updateEmployee);

router.post("/delete/:_id", controller.delete);

module.exports = router;
