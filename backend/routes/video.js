const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/zoom', authMiddleware, videoController.createZoomMeeting);
router.post('/meet', authMiddleware, videoController.createGoogleMeet);

module.exports = router;
