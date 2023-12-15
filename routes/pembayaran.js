const express = require("express");
const router = express.Router();
const cpembayaran = require("../controllers/pembayaranController");

router.put("/update/:id", cpembayaran.update);
router.get("/getAll", cpembayaran.getAll);
router.get("/getByMonth/:month", cpembayaran.getByMonth);
router.get("/getByUserId/:id", cpembayaran.getByUserId);
router.get("/getByUserIdBulan/:id/:month", cpembayaran.getByUserIdBulan);

module.exports = router;