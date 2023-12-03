const express = require("express");
const router = express.Router();
const cadmin = require("../controllers/adminController");
const cuser = require("../controllers/userController");
const cdeposit = require("../controllers/depositController");
const charga = require("../controllers/hargaController");

// Admin
router.post("/loginAdmin", cadmin.login);
router.post("/admin/create", cadmin.create);
router.put("/admin/update/:id", cadmin.update);
router.delete("/admin/delete/:id", cadmin.delete);
router.get("/admin", cadmin.getAll);
router.get("/admin/:id", cadmin.getOne);

// User
router.post("/user/create", cuser.create);
router.put("/user/update/:id", cuser.update);
router.get("/user", cuser.getAll);
router.get("/user/:id", cuser.getOne);

// Deposit
router.put("/deposit/update/:id", cdeposit.update);
router.get("/deposit", cdeposit.getAll);
router.get("/deposit/:id", cdeposit.getById);

// Harga
router.post("/harga/create", charga.create);
router.put("/harga/update/:id", charga.update);
router.delete("/harga/delete/:id", charga.delete);
router.get("/harga", charga.getAll);
router.get("/harga/:id", charga.getOne);

module.exports = router;
