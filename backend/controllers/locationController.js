const db = require('../config/db');

exports.getNearbyProviders = async (req, res) => {
    try {
        const { latitude, longitude, radius, specialization } = req.query;
        
        if (!latitude || !longitude || !radius) {
            return res.status(400).json({ message: "Latitude, longitude, and radius are required" });
        }

        let query = `
            SELECT p.*, 
            (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance 
            FROM providers p 
            WHERE (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) < ?
        `;
        let params = [latitude, longitude, latitude, latitude, longitude, latitude, radius];

        if (specialization) {
            query += ' AND specialization = ?';
            params.push(specialization);
        }

        query += ' ORDER BY distance';

        const [providers] = await db.query(query, params);
        
        res.json(providers);
    } catch (error) {
        console.error('Error fetching nearby providers:', error);
        res.status(500).json({ message: "Error fetching nearby providers", error: error.message });
    }
};
