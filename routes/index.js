const express = require("express");
const router = express.Router();
const mid = require("../middleware/restrict");
const auth = require("./auth");
const admin = require("./admin");
const user = require("./user");
const tagihanBulanan = require("./tagihanBulanan");
const deposit = require("./deposit");
const harga = require("./harga");
const pembayaran = require("./pembayaran");
const userPembayaran = require("./transaksi");
const whatsapp = require("./whatsapp");
const generatePdf = require("./generatePdf");
const count = require("./count");

router.use("/auth", auth);
router.use("/admin", mid.mustSuperAdmin, admin);
router.use("/user", mid.mustAdmin, user);
router.use("/tagihanBulanan", mid.mustAdmin, tagihanBulanan);
router.use("/deposit", mid.mustAdmin, deposit);
router.use("/harga", mid.mustAdmin, harga);
router.use("/pembayaran", mid.mustAdmin, pembayaran);
router.use("/prosesPembayaran", pembayaran);
router.use("/userPembayaran", userPembayaran);
router.use("/wa", mid.mustAdmin, whatsapp);
router.use("/pdf", generatePdf);
router.use("/count", count);

module.exports = router;
