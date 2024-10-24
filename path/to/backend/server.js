const db = require('./config/db'); // Renamed for clarity

// ...

// Start the server and connect to the database
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Test the database connection
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            process.exit(1); // Exit the process with failure
        }
        console.log('Database connected successfully.');
        connection.release(); // Release the connection back to the pool
    });
});
