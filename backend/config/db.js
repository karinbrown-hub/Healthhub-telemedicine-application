const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,      // Wait for connections instead of throwing error
    connectionLimit: 10,           // Maximum number of connections in the pool
    queueLimit: 0,                  // Unlimited queueing
   connectTimeout: 60000,         

});

module.exports = pool;
