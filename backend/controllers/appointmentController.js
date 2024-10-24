const db = require('../config/db');
const notificationController = require('./notificationController');
const analyticsService = require('../services/analyticsService');

exports.createAppointment = async (req, res) => {
    try {
        const { providerId, appointmentDate, appointmentTime } = req.body;
        const patientId = req.user.id;

        // Check for existing appointments at the same time
        const [existingAppointments] = await db.query(
            'SELECT * FROM appointments WHERE provider_id = ? AND appointment_date = ? AND appointment_time = ?',
            [providerId, appointmentDate, appointmentTime]
        );

        if (existingAppointments.length > 0) {
            return res.status(400).json({ message: "This time slot is already booked" });
        }

        // Check if the patient has another appointment at the same time
        const [patientAppointments] = await db.query(
            'SELECT * FROM appointments WHERE patient_id = ? AND appointment_date = ? AND appointment_time = ?',
            [patientId, appointmentDate, appointmentTime]
        );

        if (patientAppointments.length > 0) {
            return res.status(400).json({ message: "You already have an appointment at this time" });
        }

        // If no conflicts, create the appointment
        const [result] = await db.query(
            'INSERT INTO appointments (patient_id, provider_id, appointment_date, appointment_time) VALUES (?, ?, ?, ?)',
            [patientId, providerId, appointmentDate, appointmentTime]
        );

        // Create in-app notification for the provider
        await notificationController.createNotification(
            providerId,
            `New appointment scheduled with ${req.user.firstName} ${req.user.lastName} on ${appointmentDate}`,
            'appointment'
        );

        // Send email notification to the provider
        const provider = await getUserById(providerId);
        await notificationController.sendEmail(
            provider.email,
            'New Appointment Scheduled',
            `You have a new appointment scheduled with ${req.user.firstName} ${req.user.lastName} on ${appointmentDate}`
        );

        await analyticsService.trackEvent('appointment_created', { 
            providerId: providerId,
            patientId: patientId,
            date: appointmentDate
        });

        res.status(201).json({ message: "Appointment created successfully", appointmentId: result.insertId });
    } catch (error) {
        console.error('Error in createAppointment:', error);
        res.status(500).json({ message: "Error creating appointment", error: error.message });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        const userType = req.user.userType;

        let query;
        let queryParams;

        if (userType === 'patient') {
            query = `
                SELECT a.*, u.first_name as provider_first_name, u.last_name as provider_last_name 
                FROM appointments a
                JOIN users u ON a.provider_id = u.id
                WHERE a.patient_id = ?
            `;
            queryParams = [userId];
        } else if (userType === 'provider') {
            query = `
                SELECT a.*, u.first_name as patient_first_name, u.last_name as patient_last_name 
                FROM appointments a
                JOIN users u ON a.patient_id = u.id
                WHERE a.provider_id = ?
            `;
            queryParams = [userId];
        } else {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const [appointments] = await db.query(query, queryParams);

        res.json(appointments);
    } catch (error) {
        console.error('Error in getAppointments:', error);
        res.status(500).json({ message: "Error fetching appointments", error: error.message });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { appointmentDate, appointmentTime, status } = req.body;

        await db.query(
            'UPDATE appointments SET appointment_date = ?, appointment_time = ?, status = ? WHERE id = ?',
            [appointmentDate, appointmentTime, status, id]
        );

        res.json({ message: "Appointment updated successfully" });
    } catch (error) {
        console.error('Error in updateAppointment:', error);
        res.status(500).json({ message: "Error updating appointment", error: error.message });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM appointments WHERE id = ?', [id]);

        res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
        console.error('Error in deleteAppointment:', error);
        res.status(500).json({ message: "Error deleting appointment", error: error.message });
    }
};

exports.cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const userId = req.user.id;

        const [appointment] = await db.query('SELECT * FROM appointments WHERE id = ? AND (patient_id = ? OR provider_id = ?)', 
                                             [appointmentId, userId, userId]);

        if (appointment.length === 0) {
            return res.status(404).json({ message: "Appointment not found or you don't have permission to cancel it" });
        }

        await db.query('UPDATE appointments SET status = "cancelled" WHERE id = ?', [appointmentId]);

        res.json({ message: "Appointment cancelled successfully" });
    } catch (error) {
        console.error('Error in cancelAppointment:', error);
        res.status(500).json({ message: "Error cancelling appointment", error: error.message });
    }
};

exports.rescheduleAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { newDate, newTime } = req.body;
        const userId = req.user.id;

        const [appointment] = await db.query('SELECT * FROM appointments WHERE id = ? AND (patient_id = ? OR provider_id = ?)', 
                                             [appointmentId, userId, userId]);

        if (appointment.length === 0) {
            return res.status(404).json({ message: "Appointment not found or you don't have permission to reschedule it" });
        }

        // Check for conflicts
        const [conflicts] = await db.query('SELECT * FROM appointments WHERE provider_id = ? AND appointment_date = ? AND appointment_time = ? AND id != ?',
                                           [appointment[0].provider_id, newDate, newTime, appointmentId]);

        if (conflicts.length > 0) {
            return res.status(400).json({ message: "The new time slot is already booked" });
        }

        await db.query('UPDATE appointments SET appointment_date = ?, appointment_time = ? WHERE id = ?', 
                       [newDate, newTime, appointmentId]);

        res.json({ message: "Appointment rescheduled successfully" });
    } catch (error) {
        console.error('Error in rescheduleAppointment:', error);
        res.status(500).json({ message: "Error rescheduling appointment", error: error.message });
    }
};
