require('dotenv').config();
const express = require('express');
const router = express.Router();
const ongkirController = require('../controllers/ongkirController');

router.get('/provinces', ongkirController.getProvinces);
router.get('/cities/:provinceId', ongkirController.getCities);
router.post('/cost', ongkirController.getCost); 

module.exports = router;
