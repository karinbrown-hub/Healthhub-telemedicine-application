const Joi = require('joi');
const db = require('../config/db');

const reviewSchema = Joi.object({
    doctorId: Joi.number().integer().positive().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().allow('').optional()
});

exports.createReview = async (req, res) => {
    try {
        const { error } = reviewSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { doctorId, rating, comment } = req.body;
        const patientId = req.user.id;

        const [result] = await db.query(
            'INSERT INTO reviews (patient_id, doctor_id, rating, comment) VALUES (?, ?, ?, ?)',
            [patientId, doctorId, rating, comment]
        );

        res.status(201).json({ message: 'Review created successfully', reviewId: result.insertId });
    } catch (error) {
        console.error('Error in createReview:', error);
        res.status(500).json({ message: 'Error creating review', error: error.message });
    }
};

exports.getDoctorReviews = async (req, res) => {
    try {
        const { doctorId } = req.params;

        if (!Number.isInteger(Number(doctorId))) {
            return res.status(400).json({ message: 'Invalid doctor ID' });
        }

        const [reviews] = await db.query(
            'SELECT r.*, u.first_name, u.last_name FROM reviews r JOIN users u ON r.patient_id = u.id WHERE r.doctor_id = ?',
            [doctorId]
        );

        res.json(reviews);
    } catch (error) {
        console.error('Error in getDoctorReviews:', error);
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};
