const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");

router.get("/login", controller.login);

router.post("/login", controller.postLogin);

router.get("/signup", controller.signup);

router.post("/signup", controller.postSignUp);

router.get("/logout", controller.postLogout);

module.exports = router;