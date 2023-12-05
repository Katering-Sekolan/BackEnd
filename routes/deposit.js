const express = require("express");
const router = express.Router();
const cdeposit = require("../controllers/depositController");

router.put("/update/:id", cdeposit.update);
router.get("/", cdeposit.getAll);
router.get("/:id", cdeposit.getById);

module.exports = router;
