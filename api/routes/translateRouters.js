const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translateController');

router.post('/', translateController.translateText);

module.exports = router;
