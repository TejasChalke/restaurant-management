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

router.post('/add-online-order', async (req, res) => {
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Extract data from the POST request body
        const { user_id, total, address, orderDate, orderTime, status, deliveryContact, orderItemsIds } = req.body;

        // Add data inside the 'online_orders' table
        const [result] = await connection.execute(
            "INSERT INTO online_orders (user_id, total, address, date, time, status, delivery_contact) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [user_id, total, address, orderDate, orderTime, status, deliveryContact]
        );

        // Construct the SQL query dynamically
        let sql = `
        INSERT INTO order_items (online_order_id, table_order_id, menu_item_id)
        VALUES 
        `;

        // Generate placeholders for the values in the query
        const placeholders = orderItemsIds.map(() => '(?, ?, ?)').join(', ');

        // Append the placeholders to the SQL query
        sql += placeholders;

        // Generate an array of parameters for the query
        const params = orderItemsIds.flatMap(menu_item_id => [result.insertId, null, menu_item_id]);

        // Insert the data into the order_items table
        const [orderItemsResult] = await connection.execute(sql, params);

        // Release the connection back to the pool
        connection.release();

        if (orderItemsResult.affectedRows > 0) {
            res.json({ message: "Order added successfully" });
        } else {
            res.status(500).json({ error: "Failed to add order" });
        }
    } catch (error) {
        console.error("Error adding order data to MySQL:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/all-user-orders', authenticateToken, async (req, res) => {
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Extract data from the POST request body
        const { user_id } = req.body;

        // Add data inside the 'online_orders' table
        const [result] = await connection.execute(
            "SELECT id, total, date, time, status FROM online_orders where user_id = ?",
            [user_id]
        );
        
        res.status(200).json(result);
    } catch (error) {
        console.error("Error getting user orders data from MySQL:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/user-order', authenticateToken, async (req, res) => {
    try {
      // Get a connection from the pool
      const connection = await pool.getConnection();
    
      // Extract data from the POST request body
      const { id } = req.body;

      // Get data from the 'online_orders' table
      const [result] = await connection.execute(
        'Select id, total, address, status, delivery_contact FROM online_orders where id = ?',
        [id]
      );
  
      // Release the connection back to the pool
      connection.release();
  
      if (result.length > 0) {
        res.status(200).json(result[0]);
      } else {
        res.status(404).json({ error: 'Order with the ID {' + id + '} was not found' });
      }
    } catch (error) {
      console.error('Error getting user order from MySQL:', error);
      res.status(500).send('Internal Server Error');
    }
});

router.delete('/user-order', authenticateToken, async (req, res) => {
    try {
      // Get a connection from the pool
      const connection = await pool.getConnection();
    
      // Extract data from the POST request body
      const { id } = req.body;

      // Delete data from the 'order_items' table
      const [_] = await connection.execute(
        'Delete FROM order_items where online_order_id = ?',
        [id]
      );
  
      // Delete data from the 'online_orders' table
      const [result] = await connection.execute(
        'Delete FROM online_orders where id = ?',
        [id]
      );
  
      // Release the connection back to the pool
      connection.release();
  
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Order deleted successfully' });
      } else {
        res.status(200).json({ error: 'Order with the ID {' + id + '} was not found' });
      }
    } catch (error) {
      console.error('Error deleting user Order from MySQL:', error);
      res.status(500).send('Internal Server Error');
    }
});
  

module.exports = router;