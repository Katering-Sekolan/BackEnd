const express = require("express");
const router = express.Router();
const cuserPembayaran = require("../controllers/transaksiController");

router.post("/createTransaction", cuserPembayaran.createTransaction);
router.post("/notification", cuserPembayaran.notificationHandler);


module.exports = router;