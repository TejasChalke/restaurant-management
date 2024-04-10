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
      const { seats, user_id, date, time, user_name } = req.body;
  
      // Add data inside the 'reservations' table
      const [result] = await connection.execute(
        'INSERT INTO reservations (seats, user_id, date, time, user_name) VALUES (?, ?, ?, ?, ?)',
        [seats, user_id, date, time, user_name]
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

router.post('/get-user-reservations', authenticateToken, async (req, res) => {
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

router.get('/all-reservations', async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Get data from the 'reservations' table
    const [result] = await connection.execute(
      'Select * FROM reservations where status = ? OR status = ?',
      ['requested', 'approved']
    );    

    // Release the connection back to the pool
    connection.release();

    setTimeout(() => {
      res.status(200).json(result);
    }, 200)
  } catch (error) {
    console.error('Error getting user reservations from MySQL:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/update-user-reservation', async (req, res) => {
  // Check if 'id' is present in the request body
  if (!req.body.id) {
      return res.status(400).json({ error: 'Reservation ID is required in the request body' });
  }
  try {
      // Get a connection from the pool
      const connection = await pool.getConnection();

      // Update the MySQL table based on the received data and id
      const [result] = await connection.execute(
          `UPDATE reservations SET status = ? WHERE id = ?`,
          [req.body.new_status, req.body.id]
      );

      // Release the connection back to the pool
      connection.release();

      if (result.affectedRows > 0) {
          res.json({ message: `Reservation with id ${req.body.id} updated successfully` });
      } else {
          res.status(404).json({ error: `User with id ${req.body.id} not found` });
      }
  } catch (error) {
      console.error('Error updating user data in MySQL:', error);
      res.status(500).send('Internal Server Error');
  }
})

module.exports = router;