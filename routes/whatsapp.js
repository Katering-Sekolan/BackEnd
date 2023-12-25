const express = require("express");
const router = express.Router();
const cwhatsapp = require("../controllers/whatsappController");

router.post("/sendMessage", cwhatsapp.sendMessage);
router.post("/broadcastMessage", cwhatsapp.broadcastBill);

module.exports = router;