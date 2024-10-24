const db = require('../config/db');

exports.searchProviders = async (req, res) => {
    try {
        const { name, specialization, rating } = req.query;
        
        let query = `
            SELECT u.id, u.first_name, u.last_name, u.email, p.specialization, 
                   AVG(r.rating) as average_rating
            FROM users u
            JOIN providers p ON u.id = p.user_id
            LEFT JOIN reviews r ON u.id = r.provider_id
            WHERE u.user_type = 'provider'
        `;

        const queryParams = [];

        if (name) {
            query += ` AND (u.first_name LIKE ? OR u.last_name LIKE ?)`;
            queryParams.push(`%${name}%`, `%${name}%`);
        }

        if (specialization) {
            query += ` AND p.specialization = ?`;
            queryParams.push(specialization);
        }

        query += ` GROUP BY u.id`;

        if (rating) {
            query += ` HAVING average_rating >= ?`;
            queryParams.push(parseFloat(rating));
        }

        query += ` ORDER BY average_rating DESC`;

        const [results] = await db.query(query, queryParams);

        res.json(results);
    } catch (error) {
        console.error('Error in searchProviders:', error);
        res.status(500).json({ message: 'Error searching providers', error: error.message });
    }
};
