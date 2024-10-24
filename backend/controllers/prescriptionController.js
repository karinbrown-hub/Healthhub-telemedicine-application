const Joi = require('joi');
const db = require('../config/db');

const prescriptionSchema = Joi.object({
  patientId: Joi.number().integer().positive().required(),
  medication: Joi.string().required(),
  dosage: Joi.string().required(),
  frequency: Joi.string().required(),
  duration: Joi.string().required()
});

exports.createPrescription = async (req, res) => {
  try {
    const { error } = prescriptionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { patientId, medication, dosage, frequency, duration } = req.body;
    const doctorId = req.user.id;

    const [result] = await db.query(
      'INSERT INTO prescriptions (doctor_id, patient_id, medication, dosage, frequency, duration) VALUES (?, ?, ?, ?, ?, ?)',
      [doctorId, patientId, medication, dosage, frequency, duration]
    );

    res.status(201).json({ message: 'Prescription created successfully', prescriptionId: result.insertId });
  } catch (error) {
    console.error('Error in createPrescription:', error);
    res.status(500).json({ message: 'Error creating prescription', error: error.message });
  }
};

exports.getPrescriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.userType;

    let query;
    if (userType === 'doctor') {
      query = 'SELECT * FROM prescriptions WHERE doctor_id = ?';
    } else {
      query = 'SELECT * FROM prescriptions WHERE patient_id = ?';
    }

    const [prescriptions] = await db.query(query, [userId]);
    res.json(prescriptions);
  } catch (error) {
    console.error('Error in getPrescriptions:', error);
    res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
  }
};
