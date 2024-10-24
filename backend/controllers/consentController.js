const db = require('../config/db');

exports.recordConsent = async (req, res) => {
    try {
        const userId = req.user.id;
        const { consentGiven } = req.body;

        const [result] = await db.query(
            'INSERT INTO user_consents (user_id, consent_type, consent_given) VALUES (?, "telemedicine", ?)',
            [userId, consentGiven]
        );

        res.status(201).json({ message: 'Consent recorded successfully', consentId: result.insertId });
    } catch (error) {
        console.error('Error recording consent:', error);
        res.status(500).json({ message: 'Error recording consent', error: error.message });
    }
};
