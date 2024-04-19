const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { authenticateToken } = require('../server_modules/auth');

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

router.get('/get-menu', async (req, res) => {
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

router.get('/get-available-menu', async (req, res) => {
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Query the MySQL table
        const [rows, fields] = await connection.execute(`SELECT * FROM menu_items where status = 'available'`);

        // Release the connection back to the pool
        connection.release();

        // Send the retrieved data in the response
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving data from MySQL:', error);
        res.status(500).send('Internal Server Error');
    }
});

// get data as per the searchItem
router.get('/search', async (req, res) => {
    try {
        const searchItem = req.query.searchItem;

        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Query the MySQL table
        const [rows] = await connection.execute(`SELECT id, name, price FROM menu_items where name like '%${searchItem}%'`);

        // Release the connection back to the pool
        connection.release();

        // Send the retrieved data in the response
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving data from MySQL:', error);
        res.status(500).send('Internal Server Error');
    }
})

// API route to update menu item data in MySQL table
router.put('/update-menu', authenticateToken, async (req, res) => {
    const newData = req.body;
  
    // Check if 'id' is present in the request body
    if (!newData.id) {
        return res.status(400).json({ error: 'ID is required in the request body' });
    }
    
    const id = newData.id;
    delete newData.id; // Remove 'id' from newData to avoid updating it
    
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Construct the SET clause dynamically based on newData keys
        const setClause = Object.keys(newData).map((key) => `${key} = ?`).join(', ');

        // Update the MySQL table based on the received data and id
        const [result] = await connection.execute(
            `UPDATE menu_items SET ${setClause} WHERE id = ?`,
            [...Object.values(newData), id]
        );

        // Release the connection back to the pool
        connection.release();

        if (result.affectedRows > 0) {
            res.json({ message: `Data with id ${id} updated successfully` });
        } else {
            res.status(404).json({ error: `Data with id ${id} not found` });
        }
    } catch (error) {
        console.error('Error updating data in MySQL:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;