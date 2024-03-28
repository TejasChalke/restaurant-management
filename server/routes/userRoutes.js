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
        
        const userToken = getAccessToken({name: rows[0].name, id: rows[0].id})
        const userData = {...rows[0], accessToken: userToken}

        // Release the connection back to the pool
        connection.release();

        // Send the retrieved data in the response
        res.json(userData);
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

  
// API route to update menu item data in MySQL table
router.put('/update-user', authenticateToken, async (req, res) => {
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
          `UPDATE users SET ${setClause} WHERE id = ?`,
          [...Object.values(newData), id]
      );

      // Release the connection back to the pool
      connection.release();

      if (result.affectedRows > 0) {
          res.json({ message: `User with id ${id} updated successfully` });
      } else {
          res.status(404).json({ error: `User with id ${id} not found` });
      }
  } catch (error) {
      console.error('Error updating user data in MySQL:', error);
      res.status(500).send('Internal Server Error');
  }
});


module.exports = router;