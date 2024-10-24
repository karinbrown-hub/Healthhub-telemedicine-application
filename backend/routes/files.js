const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/upload', authMiddleware, fileController.uploadFile, (req, res) => {
  res.json({ message: 'File uploaded successfully', file: req.file });
});

router.get('/', authMiddleware, fileController.getFiles);

module.exports = router;
