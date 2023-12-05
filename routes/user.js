const express = require("express");
const router = express.Router();
const cuser = require("../controllers/userController");

router.post("/create", cuser.create);
router.put("/update/:id", cuser.update);
router.get("/", cuser.getAll);
router.delete("/delete/:id", cuser.deleteOne);
router.get("/:id", cuser.getOne);

module.exports = router;
