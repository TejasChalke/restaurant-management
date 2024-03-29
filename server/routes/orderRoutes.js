const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { getAccessToken, authenticateToken } = require('../server_modules/auth');

// load environment variables from .env file
require('dotenv').config();

// MySQL database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// create a connection pool
const pool = mysql.createPool(dbConfig);

router.post('/add-order', async (req, res) => {
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Extract data from the POST request body
        // const { name, email, address = "", contact = "", password } = req.body;

        // Add data inside the 'users' table
        // const [result] = await connection.execute(
        // "INSERT INTO users (name, email, address, contact, password) VALUES (?, ?, ?, ?, ?)",
        // [name, email, address, contact, password]
        // );

        // Release the connection back to the pool
        connection.release();

        if (result.affectedRows > 0) {
            res.json({ message: "Order added successfully" });
        } else {
            res.status(500).json({ error: "Failed to add order" });
        }
    } catch (error) {
        console.error("Error adding order data to MySQL:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;