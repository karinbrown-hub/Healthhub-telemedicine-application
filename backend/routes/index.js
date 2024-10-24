const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const appointmentController = require('../controllers/appointmentController');
const messageController = require('../controllers/messageController');
const paymentController = require('../controllers/paymentController');
const medicalRecordController = require('../controllers/medicalRecordController');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

// Appointment routes
router.post('/appointments', authMiddleware, appointmentController.createAppointment);
router.get('/appointments', authMiddleware, appointmentController.getAppointments);
router.put('/appointments/:id', authMiddleware, appointmentController.updateAppointment);
router.delete('/appointments/:id', authMiddleware, appointmentController.deleteAppointment);
router.post('/appointments/:appointmentId/cancel', authMiddleware, appointmentController.cancelAppointment);
router.post('/appointments/:appointmentId/reschedule', authMiddleware, appointmentController.rescheduleAppointment);

// Message routes
router.post('/messages', authMiddleware, messageController.sendMessage);
router.get('/messages', authMiddleware, messageController.getMessages);

// Payment routes
router.post('/payments', authMiddleware, paymentController.processPayment);
router.get('/payments', authMiddleware, paymentController.getPaymentHistory);

// Medical record routes
router.post('/medical-records', authMiddleware, medicalRecordController.createMedicalRecord);
router.get('/medical-records', authMiddleware, medicalRecordController.getMedicalRecords);

// Review routes
router.post('/reviews', authMiddleware, reviewController.createReview);
router.get('/reviews/:providerId', reviewController.getProviderReviews);

// New routes
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.get('/verify-email/:token', userController.verifyEmail);
router.post('/change-password', authMiddleware, userController.changePassword);

module.exports = router;
