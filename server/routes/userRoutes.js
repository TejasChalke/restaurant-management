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

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Query the MySQL table
        const [rows, fields] = await connection.execute(
            'SELECT id, name, contact, email, address FROM users where email = ? AND password = ?',
            [email, password] 
        );

        // Release the connection back to the pool
        connection.release();

        // Send the retrieved data in the response
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving data from MySQL:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/signup', async (req, res) => {
    try {
      // Get a connection from the pool
      const connection = await pool.getConnection();
  
      // Extract data from the POST request body
      const { name, email, address = '', contact = '', password } = req.body;
  
      // Add data inside the 'users' table
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, address, contact, password) VALUES (?, ?, ?, ?, ?)',
        [name, email, address, contact, password]
      );
  
      // Release the connection back to the pool
      connection.release();
  
      if (result.affectedRows > 0) {
        res.json({ message: 'User added successfully' });
      } else {
        res.status(500).json({ error: 'Failed to add user' });
      }
    } catch (error) {
      console.error('Error adding user data to MySQL:', error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;