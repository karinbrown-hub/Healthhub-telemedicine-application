const db = require('../config/db');

exports.recordMetric = async (req, res) => {
    try {
        const { metricType, value } = req.body;
        const userId = req.user.id;

        const [result] = await db.query(
            'INSERT INTO health_metrics (user_id, metric_type, value) VALUES (?, ?, ?)',
            [userId, metricType, value]
        );

        res.status(201).json({ message: 'Health metric recorded successfully', metricId: result.insertId });
    } catch (error) {
        console.error('Error recording health metric:', error);
        res.status(500).json({ message: 'Error recording health metric', error: error.message });
    }
};

exports.getMetrics = async (req, res) => {
    try {
        const userId = req.user.id;
        const { metricType } = req.query;

        let query = 'SELECT * FROM health_metrics WHERE user_id = ?';
        const params = [userId];

        if (metricType) {
            query += ' AND metric_type = ?';
            params.push(metricType);
        }

        query += ' ORDER BY recorded_at DESC';

        const [metrics] = await db.query(query, params);

        res.json(metrics);
    } catch (error) {
        console.error('Error fetching health metrics:', error);
        res.status(500).json({ message: 'Error fetching health metrics', error: error.message });
    }
};
