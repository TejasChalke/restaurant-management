const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

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

router.get('/login', async (req, res) => {
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Query the MySQL table
        const [rows, fields] = await connection.execute('SELECT * FROM menu_items');

        // Release the connection back to the pool
        connection.release();

        // Send the retrieved data in the response
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving data from MySQL:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/signup', async (req, res) => {
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Query the MySQL table
        const [rows, fields] = await connection.execute('SELECT * FROM menu_items');

        // Release the connection back to the pool
        connection.release();

        // Send the retrieved data in the response
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving data from MySQL:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;