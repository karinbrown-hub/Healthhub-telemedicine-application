const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const authMiddleware = require('../middleware/authMiddleware');

console.log('medicalRecordController:', medicalRecordController);
console.log('createMedicalRecord:', medicalRecordController.createMedicalRecord);
console.log('getMedicalRecords:', medicalRecordController.getMedicalRecords);
console.log('updateRecord:', medicalRecordController.updateRecord);

router.post('/', authMiddleware, medicalRecordController.createMedicalRecord);
router.get('/', authMiddleware, medicalRecordController.getMedicalRecords);
router.put('/:id', authMiddleware, medicalRecordController.updateRecord);

// Remove or comment out this duplicate route
// router.post('/medical-records', (req, res) => {
//   res.status(200).json({ message: 'Medical record created successfully' });
// });

module.exports = router;
