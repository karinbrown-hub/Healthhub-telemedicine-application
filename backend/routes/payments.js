const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-payment-intent', authMiddleware, paymentController.createPaymentIntent);
router.post('/record', authMiddleware, paymentController.recordPayment);

module.exports = router;
