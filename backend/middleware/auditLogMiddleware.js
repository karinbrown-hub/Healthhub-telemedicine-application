const db = require('../config/db');

const auditLog = async (req, res, next) => {
    const originalJson = res.json;
    res.json = function (data) {
        res.locals.responseBody = data;
        originalJson.call(this, data);
    }

    next();

    const userId = req.user ? req.user.id : null;
    const action = `${req.method} ${req.originalUrl}`;
    const details = JSON.stringify({
        request: {
            body: req.body,
            params: req.params,
            query: req.query
        },
        response: res.locals.responseBody
    });
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');

    try {
        await db.query(
            'INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
            [userId, action, details, ipAddress, userAgent]
        );
    } catch (error) {
        console.error('Error creating audit log:', error);
    }
};

module.exports = auditLog;
