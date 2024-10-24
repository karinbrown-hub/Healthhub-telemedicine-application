const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { encrypt, decrypt } = require('../utils/encryption');
const transporter = nodemailer.createTransport({
    service: 'gmail',  // or another service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const Joi = require('joi');

const registerSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
   userType: Joi.string().valid('patient', 'provider', 'admin').required(),
    specialization: Joi.string().when('userType', { is: 'provider', then: Joi.required(), otherwise: Joi.optional() })
});

exports.register = async (req, res) => {
    try {
       // Validate input
       const { error } = registerSchema.validate(req.body);
       if (error) {
           return res.status(400).json({ message: error.details[0].message });
       }

       const { firstName, lastName, email, password, phone, dateOfBirth, gender, userType, specialization } = req.body;


        // Check if user already exists
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Generate a unique ID
        const uniqueId = generateUniqueId();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user
        const [result] = await db.query(
            'INSERT INTO users (unique_id, first_name, last_name, email, password_hash, phone, date_of_birth, gender, user_type, specialization) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [uniqueId, firstName, lastName, email, hashedPassword, phone, dateOfBirth, gender, userType, specialization]
        );

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error('Error in register:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "User with this email already exists" });
        }
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

              
function generateUniqueId() {
    return crypto.randomBytes(16).toString('hex');
}

// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

//         if (users.length === 0) {
//             return res.status(401).json({ message: "Invalid email or password" });
//         }

//         const user = users[0];
//         const isPasswordValid = await bcrypt.compare(password, user.password_hash);

//         if (!isPasswordValid) {
//             return res.status(401).json({ message: "Invalid email or password" });
//         }

//         const accessToken = jwt.sign(
//             { 
//                 userId: user.id, 
//                 uniqueId: user.unique_id,
//                 userType: user.user_type 
//             },
//             process.env.ACCESS_TOKEN_SECRET,
//             { expiresIn: '15m' }
//         );
//         const refreshToken = generateRefreshToken(user);
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find the user
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
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
        const accessToken = jwt.sign(
            { userId: user.id, userType: user.user_type },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

    //    
    const refreshToken = generateRefreshToken(user);

        // Store refresh token in database
        await db.query('INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)', [user.id, refreshToken]);

        // Set cookies without secure flag for development
        res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax', maxAge: 15 * 60 * 1000 }); // 15 minutes
        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days

        res.json({ 
            message: "Login successful", 
            token: accessToken,
            userId: user.id, 
            userType: user.user_type 
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have middleware that sets req.user

        const [users] = await db.query('SELECT id, first_name, last_name, email, phone, date_of_birth, gender, address, user_type, specialization FROM users WHERE id = ?', [userId]);

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ message: "Error fetching user profile", error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, phone, dateOfBirth, gender, address } = req.body;

        await db.query('UPDATE users SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE id = ?',
            [firstName, lastName, phone, dateOfBirth, gender, address, userId]);

        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const [user] = await db.query('SELECT password_hash FROM users WHERE id = ?', [userId]);

        const isPasswordValid = await bcrypt.compare(currentPassword, user[0].password_hash);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedNewPassword, userId]);

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error('Error in changePassword:', error);
        res.status(500).json({ message: "Error changing password", error: error.message });
    }
};

exports.refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
    }

    try {
        const [tokens] = await db.query('SELECT * FROM refresh_tokens WHERE token = ?', [refreshToken]);

        if (tokens.length === 0) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                await db.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
                return res.status(403).json({ message: "Invalid refresh token" });
            }

            const accessToken = generateAccessToken({ id: user.userId, user_type: user.userType });

            res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 15 * 60 * 1000 });
            res.json({ message: "Token refreshed successfully" });
        });
    } catch (error) {
        console.error('Error in refresh:', error);
        res.status(500).json({ message: "Error refreshing token", error: error.message });
    }
};

exports.logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        await db.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: "Logged out successfully" });
};

function generateAccessToken(user) {
    return jwt.sign({ userId: user.id, userType: user.user_type }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
    return jwt.sign({ userId: user.id, userType: user.user_type }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

        await db.query('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?', 
                       [resetToken, resetTokenExpiry, user[0].id]);

        // Send email with reset link
        const transporter = nodemailer.createTransport({
            // Configure your email service here
        });

        await transporter.sendMail({
            to: user[0].email,
            subject: 'Password Reset',
            html: `<p>You requested a password reset. Click <a href="http://yourdomain.com/reset-password/${resetToken}">here</a> to reset your password.</p>`
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
        const [user] = await db.query('SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?', 
                                      [token, Date.now()]);

        if (user.length === 0) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.query('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?', 
                       [hashedPassword, user[0].id]);

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const [result] = await db.query('UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = ?', [token]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Invalid verification token" });
        }

        res.json({ message: "Email verified successfully" });
    } catch (error) {
        console.error('Error in verifyEmail:', error);
        res.status(500).json({ message: "Error verifying email", error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, dateOfBirth, phone } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const encryptedDateOfBirth = encrypt(dateOfBirth);
        const encryptedPhone = encrypt(phone);

        const [result] = await db.query(
            'INSERT INTO users (first_name, last_name, email, password, date_of_birth, phone) VALUES (?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword, encryptedDateOfBirth, encryptedPhone]
        );

        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error in createUser:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];
        user.date_of_birth = decrypt(user.date_of_birth);
        user.phone = decrypt(user.phone);

        res.json(user);
    } catch (error) {
        console.error('Error in getUser:', error);
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

    