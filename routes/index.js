const express = require("express");
const router = express.Router();
const cadmin = require("../controllers/admin");
const cuser = require("../controllers/user");

// Admin
router.post("/loginAdmin", cadmin.login);

// User
router.get("/user", cuser.getAll);
router.get("/user/:id", cuser.getOne);
router.post("/register", cuser.register);
router.post("/login", cuser.login);

module.exports = router;