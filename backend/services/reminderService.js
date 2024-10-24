const cron = require('node-cron');
const db = require('../config/db');
const nodemailer = require('nodemailer');

const sendReminderEmails = async () => {
    try {
        const [appointments] = await db.query(`
            SELECT a.*, u.email, u.first_name 
            FROM appointments a
            JOIN users u ON a.patient_id = u.id
            WHERE a.appointment_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
        `);

        const transporter = nodemailer.createTransport({
            // Configure your email service here
        });

        for (let appointment of appointments) {
            await transporter.sendMail({
                to: appointment.email,
                subject: 'Appointment Reminder',
                html: `<p>Hello ${appointment.first_name}, this is a reminder that you have an appointment tomorrow at ${appointment.appointment_time}.</p>`
            });
        }
    } catch (error) {
        console.error('Error sending reminder emails:', error);
    }
};

// Run every day at midnight
cron.schedule('0 0 * * *', sendReminderEmails);
