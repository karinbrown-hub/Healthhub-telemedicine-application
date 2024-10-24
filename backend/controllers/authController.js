const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, dateOfBirth, gender, address } = req.body;

        // Validate input
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if email already exists
        const [existingUser] = await db.query('SELECT * FROM patients WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new patient into the database
        const [result] = await db.query(
            'INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword, phoneNumber, dateOfBirth, gender, address]
        );

        res.status(201).json({ message: "Patient registered successfully", userId: result.insertId });
    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ message: "Error registering patient", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find the user
        const [users] = await db.query('SELECT * FROM patients WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = users[0];

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { 
              userId: user.patient_id, 
              email: user.email,
              role: 'patient' // Or determine this based on the user type
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '15m' }
          );
           // Include userType in the response
        res.json({ 
            message: "Login successful", 
            token,
            userType: 'patient', // Add this line
            userId: user.patient_id
        });
          
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const [users] = await db.query('SELECT * FROM patients WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = users[0];

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

        // Save reset token and expiry to database
        await db.query('UPDATE patients SET reset_token = ?, reset_token_expiry = ? WHERE patient_id = ?', 
                       [resetToken, resetTokenExpiry, user.patient_id]);

        // Send email
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset',
            html: `<p>You requested a password reset. Click <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">here</a> to reset your password.</p>`
        });

        res.json({ message: "Password reset email sent" });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: "Error processing password reset", error: error.message });
    }
};
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Find user with valid reset token
        const [users] = await db.query('SELECT * FROM patients WHERE reset_token = ? AND reset_token_expiry > ?', [token, Date.now()]);
        if (users.length === 0) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        const user = users[0];

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        await db.query('UPDATE patients SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE patient_id = ?', 
                       [hashedPassword, user.patient_id]);

        res.json({ message: "Password has been reset successfully" });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};