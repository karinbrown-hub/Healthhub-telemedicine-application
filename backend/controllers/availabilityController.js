const db = require('../config/db');

exports.setAvailability = async (req, res) => {
    try {
        const providerId = req.user.id;
        const { dayOfWeek, startTime, endTime } = req.body;

        const [result] = await db.query(
            'INSERT INTO availability (provider_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?) ' +
            'ON DUPLICATE KEY UPDATE start_time = VALUES(start_time), end_time = VALUES(end_time)',
            [providerId, dayOfWeek, startTime, endTime]
        );

        res.status(201).json({ message: 'Availability set successfully', availabilityId: result.insertId });
    } catch (error) {
        console.error('Error in setAvailability:', error);
        res.status(500).json({ message: 'Error setting availability', error: error.message });
    }
};

exports.getProviderAvailability = async (req, res) => {
    try {
        const providerId = req.params.providerId;

        const [availability] = await db.query(
            'SELECT * FROM availability WHERE provider_id = ? ORDER BY FIELD(day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), start_time',
            [providerId]
        );

        res.json(availability);
    } catch (error) {
        console.error('Error in getProviderAvailability:', error);
        res.status(500).json({ message: 'Error fetching availability', error: error.message });
    }
};

exports.deleteAvailability = async (req, res) => {
    try {
        const providerId = req.user.id;
        const availabilityId = req.params.availabilityId;

        const [result] = await db.query(
            'DELETE FROM availability WHERE id = ? AND provider_id = ?',
            [availabilityId, providerId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Availability not found or you do not have permission to delete it' });
        }

        res.json({ message: 'Availability deleted successfully' });
    } catch (error) {
        console.error('Error in deleteAvailability:', error);
        res.status(500).json({ message: 'Error deleting availability', error: error.message });
    }
};
