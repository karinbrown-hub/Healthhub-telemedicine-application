const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/providers', searchController.searchProviders);

module.exports = router;
