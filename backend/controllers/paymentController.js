const db = require('../config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Joi = require('joi');

const paymentIntentSchema = Joi.object({
    amount: Joi.number().integer().positive().required()
});

const recordPaymentSchema = Joi.object({
    appointmentId: Joi.number().integer().positive().required(),
    amount: Joi.number().positive().required(),
    paymentIntentId: Joi.string().required()
});

exports.processPayment = async (req, res) => {
    try {
        const { amount, token, appointmentId } = req.body;
        const userId = req.user.id;

        const charge = await stripe.charges.create({
            amount: amount * 100, // Stripe expects amount in cents
            currency: 'usd',
            source: token,
            description: `Payment for appointment ${appointmentId}`
        });

        const [result] = await db.query(
            'INSERT INTO payments (user_id, amount, stripe_charge_id, appointment_id) VALUES (?, ?, ?, ?)',
            [userId, amount, charge.id, appointmentId]
        );

        await db.query('UPDATE appointments SET payment_status = ? WHERE id = ?', ['paid', appointmentId]);

        res.json({ message: "Payment processed successfully", paymentId: result.insertId });
    } catch (error) {
        console.error('Error in processPayment:', error);
        res.status(500).json({ message: "Error processing payment", error: error.message });
    }
};

exports.getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const [payments] = await db.query(
            `SELECT p.*, a.appointment_date, a.appointment_time 
            FROM payments p
            JOIN appointments a ON p.appointment_id = a.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC`,
            [userId]
        );

        res.json(payments);
    } catch (error) {
        console.error('Error in getPaymentHistory:', error);
        res.status(500).json({ message: "Error fetching payment history", error: error.message });
    }
};

exports.createPaymentIntent = async (req, res) => {
    try {
        const { error } = paymentIntentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error in createPaymentIntent:', error);
        res.status(500).json({ message: 'Error creating payment intent', error: error.message });
    }
};

exports.recordPayment = async (req, res) => {
    try {
        const { error } = recordPaymentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { appointmentId, amount, paymentIntentId } = req.body;
        const userId = req.user.id;

        const [result] = await db.query(
            'INSERT INTO payments (user_id, appointment_id, amount, payment_intent_id) VALUES (?, ?, ?, ?)',
            [userId, appointmentId, amount, paymentIntentId]
        );

        res.status(201).json({ message: 'Payment recorded successfully', paymentId: result.insertId });
    } catch (error) {
        console.error('Error in recordPayment:', error);
        res.status(500).json({ message: 'Error recording payment', error: error.message });
    }
};
