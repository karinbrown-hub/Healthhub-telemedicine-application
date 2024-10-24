const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/nearby', authMiddleware, locationController.getNearbyProviders);

module.exports = router;
