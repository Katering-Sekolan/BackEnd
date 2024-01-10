const express = require('express');
const router = express.Router();
const cgeneratePdf = require('../controllers/generatePdfController');

router.post('/generatePdf', cgeneratePdf.generatePdf);

module.exports = router;