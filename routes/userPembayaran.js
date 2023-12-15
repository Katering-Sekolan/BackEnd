const express = require("express");
const router = express.Router();
const cuserPembayaran = require("../controllers/userPembayaranController");

router.post("/createTransaction", cuserPembayaran.createTransaction);
router.post("/notification", cuserPembayaran.notificationHandler);

module.exports = router;