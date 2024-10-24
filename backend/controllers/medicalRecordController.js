const db = require('../config/db');

exports.createMedicalRecord = async (req, res) => {
    try {
        const { patientId, diagnosis, prescription, notes, appointmentId } = req.body;
        const providerId = req.user.id;

        const [result] = await db.query(
            'INSERT INTO medical_records (patient_id, provider_id, diagnosis, prescription, notes, appointment_id) VALUES (?, ?, ?, ?, ?, ?)',
            [patientId, providerId, diagnosis, prescription, notes, appointmentId]
        );

        res.status(201).json({ message: "Medical record created successfully", recordId: result.insertId });
    } catch (error) {
        console.error('Error in createMedicalRecord:', error);
        res.status(500).json({ message: "Error creating medical record", error: error.message });
    }
};

exports.getMedicalRecords = async (req, res) => {
    try {
        const userId = req.user.id;
        const userType = req.user.userType;

        let query;
        let queryParams;

        if (userType === 'patient') {
            query = `SELECT * FROM medical_records WHERE patient_id = ? ORDER BY created_at DESC`;
            queryParams = [userId];
        } else if (userType === 'provider') {
            query = `SELECT * FROM medical_records WHERE provider_id = ? ORDER BY created_at DESC`;
            queryParams = [userId];
        } else {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const [records] = await db.query(query, queryParams);

        res.json(records);
    } catch (error) {
        console.error('Error in getMedicalRecords:', error);
        res.status(500).json({ message: "Error fetching medical records", error: error.message });
    }
};

exports.updateRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { diagnosis, prescription, notes } = req.body;

        const [result] = await db.query(
            'UPDATE medical_records SET diagnosis = ?, prescription = ?, notes = ? WHERE id = ? AND patient_id = ?',
            [diagnosis, prescription, notes, id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Medical record not found or you don't have permission to update it" });
        }

        res.json({ message: "Medical record updated successfully" });
    } catch (error) {
        console.error('Error updating medical record:', error);
        res.status(500).json({ message: "Error updating medical record", error: error.message });
    }
};
