const db = require('../config/db');

exports.trackEvent = async (eventType, eventData) => {
    try {
        await db.query(
            'INSERT INTO analytics (event_type, event_data) VALUES (?, ?)',
            [eventType, JSON.stringify(eventData)]
        );
    } catch (error) {
        console.error('Error tracking event:', error);
    }
};
exports.getAppointmentStats = async (userId, userType) => {
    try {
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
                COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
                COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as upcoming
            FROM appointments
            WHERE ${userType === 'patient' ? 'patient_id' : 'provider_id'} = ?
        `, [userId]);

        return stats[0];
    } catch (error) {
        console.error('Error getting appointment stats:', error);
        throw error;
    }
};

exports.getMonthlyAppointmentTrends = async (userId, userType) => {
    try {
        const [trends] = await db.query(`
            SELECT 
                DATE_FORMAT(appointment_date, '%Y-%m') as month,
                COUNT(*) as total_appointments,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_appointments,
                COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_appointments
            FROM appointments
            WHERE ${userType === 'patient' ? 'patient_id' : 'provider_id'} = ?
            AND appointment_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(appointment_date, '%Y-%m')
            ORDER BY month
        `, [userId]);

        return trends;
    } catch (error) {
        console.error('Error getting appointment trends:', error);
        throw error;
    }
};
