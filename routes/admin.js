const express = require("express");
const router = express.Router();
const cadmin = require("../controllers/adminController");

router.post("/create", cadmin.create);
router.put("/update/:id", cadmin.update);
router.delete("/delete/:id", cadmin.delete);
router.get("/", cadmin.getAll);
router.get("/:id", cadmin.getOne);

module.exports = router;
