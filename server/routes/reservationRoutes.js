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

router.post('/new-reservation', authenticateToken, async (req, res) => {
    try {
      // Get a connection from the pool
      const connection = await pool.getConnection();
  
      // Extract data from the POST request body
      const { seats, user_id, date, time } = req.body;
  
      // Add data inside the 'reservations' table
      const [result] = await connection.execute(
        'INSERT INTO reservations (seats, user_id, date, time) VALUES (?, ?, ?, ?)',
        [seats, user_id, date, time]
      );
  
      // Release the connection back to the pool
      connection.release();
  
      if (result.affectedRows > 0) {
        res.json({ message: 'Reservation added successfully' });
      } else {
        res.status(500).json({ error: 'Failed to add reservation' });
      }
    } catch (error) {
      console.error('Error adding reservation data to MySQL:', error);
      res.status(500).send('Internal Server Error');
    }
});

router.post('/user-reservations', authenticateToken, async (req, res) => {
    try {
      // Get a connection from the pool
      const connection = await pool.getConnection();
  
      // Extract data from the POST request body
      const { user_id } = req.body;
  
      // Add data inside the 'reservations' table
      const [result] = await connection.execute(
        'SELECT id, seats, date, time, status FROM reservations where user_id = ?',
        [user_id]
      );
  
      // Release the connection back to the pool
      connection.release();
  
      res.status(200).json(result);
    } catch (error) {
      console.error('Error getting user reservation data from MySQL:', error);
      res.status(500).send('Internal Server Error');
    }
});

router.delete('/user-reservation', authenticateToken, async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
  
    // Extract data from the POST request body
    const { id } = req.body;

    // Delete data from the 'reservations' table
    const [result] = await connection.execute(
      'Delete FROM reservations where id = ?',
      [id]
    );

    // Release the connection back to the pool
    connection.release();

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Reservation deleted successfully' });
    } else {
      res.status(200).json({ error: 'Reservation with the ID was not found' });
    }
  } catch (error) {
    console.error('Error deleting user reservation from MySQL:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;