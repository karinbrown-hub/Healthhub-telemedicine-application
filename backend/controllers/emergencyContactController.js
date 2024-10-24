const db = require('../config/db');

exports.addEmergencyContact = async (req, res) => {
    try {
        const { name, relationship, phone } = req.body;
        const userId = req.user.id;

        const [result] = await db.query(
            'INSERT INTO emergency_contacts (user_id, name, relationship, phone) VALUES (?, ?, ?, ?)',
            [userId, name, relationship, phone]
        );

        res.status(201).json({ message: 'Emergency contact added successfully', contactId: result.insertId });
    } catch (error) {
        console.error('Error adding emergency contact:', error);
        res.status(500).json({ message: 'Error adding emergency contact', error: error.message });
    }
};

exports.getEmergencyContacts = async (req, res) => {
    try {
        const userId = req.user.id;

        const [contacts] = await db.query(
            'SELECT * FROM emergency_contacts WHERE user_id = ?',
            [userId]
        );

        res.json(contacts);
    } catch (error) {
        console.error('Error fetching emergency contacts:', error);
        res.status(500).json({ message: 'Error fetching emergency contacts', error: error.message });
    }
};
