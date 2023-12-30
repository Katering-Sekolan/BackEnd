const express = require("express");
const router = express.Router();
const cwhatsapp = require("../controllers/whatsappController");

router.post("/sendMessage", cwhatsapp.sendMessage);
router.post("/broadcastMessage/:month", cwhatsapp.broadcastBill);
router.post("/logout", cwhatsapp.logOut);

module.exports = router;
