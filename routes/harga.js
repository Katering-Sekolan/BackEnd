const express = require("express");
const router = express.Router();
const charga = require("../controllers/hargaController");

router.post("/create", charga.create);
router.put("/update/:id", charga.update);
router.delete("/delete/:id", charga.delete);
router.get("/", charga.getAll);
router.get("/:id", charga.getOne);

module.exports = router;
