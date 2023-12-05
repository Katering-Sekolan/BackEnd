const express = require("express");
const router = express.Router();
const cauth = require("../controllers/authController");

router.post("/loginAdmin", cauth.login);

module.exports = router;
