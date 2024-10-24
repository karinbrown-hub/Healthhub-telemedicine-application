const db = require('../config/db');

exports.sendMessage = async (req, res) => {
    try {
        const { recipientId, content } = req.body;
        const senderId = req.user.id;

        const [result] = await db.query(
            'INSERT INTO messages (sender_id, recipient_id, content) VALUES (?, ?, ?)',
            [senderId, recipientId, content]
        );

        res.status(201).json({ message: "Message sent successfully", messageId: result.insertId });
    } catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({ message: "Error sending message", error: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const { otherUserId } = req.query;

        const [messages] = await db.query(
            `SELECT * FROM messages 
            WHERE (sender_id = ? AND recipient_id = ?) 
            OR (sender_id = ? AND recipient_id = ?)
            ORDER BY created_at ASC`,
            [userId, otherUserId, otherUserId, userId]
        );

        res.json(messages);
    } catch (error) {
        console.error('Error in getMessages:', error);
        res.status(500).json({ message: "Error fetching messages", error: error.message });
    }
};
