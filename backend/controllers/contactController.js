const db = require('../config/db');

exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const [result] = await db.query(
            'INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)',
            [name, email, message]
        );

        res.status(201).json({ message: "Contact form submitted successfully", submissionId: result.insertId });
    } catch (error) {
        console.error('Error in submitContactForm:', error);
        res.status(500).json({ message: "Error submitting contact form", error: error.message });
    }
};