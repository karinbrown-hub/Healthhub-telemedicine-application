const db = require('../config/db');
const nodemailer = require('nodemailer');

// Configure nodemailer (you'll need to set up your email service)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.createNotification = async (userId, message, type) => {
    try {
        const [result] = await db.query(
            'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
            [userId, message, type]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

exports.sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const [notifications] = await db.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { notificationId } = req.params;
        
        const [result] = await db.query(
            'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
            [notificationId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Notification not found or already read' });
        }

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Error marking notification as read', error: error.message });
    }
};
exports.sendAppointmentReminders = async () => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const [appointments] = await db.query(`
            SELECT a.*, 
                   p.email as patient_email, 
                   p.first_name as patient_name,
                   pr.email as provider_email,
                   pr.first_name as provider_name
            FROM appointments a
            JOIN users p ON a.patient_id = p.id
            JOIN users pr ON a.provider_id = pr.id
            WHERE DATE(a.appointment_date) = DATE(?)
            AND a.status = 'scheduled'
        `, [tomorrow]);

        for (let appointment of appointments) {
            // Create notification in database
            await this.createNotification(
                appointment.patient_id,
                `Reminder: You have an appointment with Dr. ${appointment.provider_name} tomorrow at ${appointment.appointment_time}`,
                'reminder'
            );

            // Send email
            await this.sendEmail(
                appointment.patient_email,
                'Appointment Reminder',
                `Reminder: You have an appointment with Dr. ${appointment.provider_name} tomorrow at ${appointment.appointment_time}`
            );
        }
    } catch (error) {
        console.error('Error sending reminders:', error);
        throw error;
    }
};
