const express = require("express");
const router = express.Router();
const ctagihanBulanan = require("../controllers/tagihanBulananController");

router.post("/create", ctagihanBulanan.create);
router.put("/update/:id", ctagihanBulanan.update);
router.delete("/delete/:id", ctagihanBulanan.delete);
router.get("/semuaTagihanBulanan", ctagihanBulanan.getAll);
router.get("/:month", ctagihanBulanan.getAllByMonth);

module.exports = router;
