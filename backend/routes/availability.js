const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, availabilityController.setAvailability);
router.get('/provider/:providerId', availabilityController.getProviderAvailability);
router.delete('/:availabilityId', authMiddleware, availabilityController.deleteAvailability);

module.exports = router;
