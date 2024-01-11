const express = require("express");
const router = express.Router();
const ccount = require("../controllers/countController");

router.get("/countUser", ccount.countUser);
router.get("/countAdmin", ccount.countAdmin);

module.exports = router;
