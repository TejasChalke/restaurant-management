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

// adds a new order
router.post('/add-online-order', async (req, res) => {
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Extract data from the POST request body
        const { user_id, user_name, total, address, orderDate, orderTime, status, deliveryContact, orderItems } = req.body;

        // Add data inside the 'online_orders' table
        const [result] = await connection.execute(
            "INSERT INTO online_orders (user_id, user_name, total, address, date, time, status, delivery_contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [user_id, user_name, total, address, orderDate, orderTime, status, deliveryContact]
        );

        // Construct the SQL query dynamically
        let sql = `
        INSERT INTO order_items (online_order_id, table_order_id, menu_item_id, quantity)
        VALUES 
        `;

        // Generate placeholders for the values in the query
        const placeholders = orderItems.map(() => '(?, ?, ?, ?)').join(', ');

        // Append the placeholders to the SQL query
        sql += placeholders;

        // Generate an array of parameters for the query
        const params = orderItems.flatMap(item => [result.insertId, null, item.id, item.quantity]);

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

// retrieves all orders for a specific user
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

// retrieves data about a specific user order
router.post('/user-order-data', authenticateToken, async (req, res) => {
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

// delete a specific user order
router.delete('/cancel-user-order', authenticateToken, async (req, res) => {
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

// gets all the orders which are not delivered to be displayed on the web app
router.get('/all-orders', async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Delete data from the 'order_items' table
    const [allOrders] = await connection.execute(
      'SELECT * FROM online_orders WHERE status <> ?',
      ['delivered']
    );

    const resultPromises = allOrders.map(async (order) => {
      let currObj = {
        id: order.id,
        time: order.time,
        total: order.total,
        status: order.status,
        customer: {
          name: order.user_name,
          contact: order.delivery_contact,
          address: order.address
        },
        items: []
      }

      const online_order_id = order.id
      const [allItems] = await connection.execute(
        'SELECT order_items.menu_item_id, order_items.quantity, menu_items.name, menu_items.price FROM order_items LEFT JOIN menu_items on order_items.menu_item_id = menu_items.id WHERE online_order_id = ?',
        [online_order_id]
      );

      currObj.items = allItems.map((item) => {
        return {
          dish: item.name,
          quantity: item.quantity,
          price: item.price
        }
      });

      return currObj;
    });

    // Wait for all promises to resolve
    const result = await Promise.all(resultPromises);

    // Release the connection back to the pool
    connection.release();

    setTimeout(() => {
      res.status(200).json(result);
    }, 100);
  } catch (error) {
    console.error('Error getting user orders from MySQL:', error);
    res.status(500).send('Internal Server Error');
  }
});

// updates the status for a specific order
router.put('/update-order-status', async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
  
    // Extract data from the POST request body
    const { id, newStatus } = req.body;

    // Get data from the 'online_orders' table
    const [result] = await connection.execute(
      'UPDATE online_orders SET status = ? WHERE id = ?',
      [newStatus, id]
    );

    // Release the connection back to the pool
    connection.release();

    if (result.affectedRows > 0) {
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: `Couldn't update order. Order with the ID ${id} was not found` });
    }
  } catch (error) {
    console.error('Error updating order status in MySQL:', error);
    res.status(500).send('Internal Server Error');
  }
});


// adds a table order
router.post('/add-table-order', async (req, res) => {
  try {
      // Get a connection from the pool
      const connection = await pool.getConnection();

      // Extract data from the POST request body
      const { total, seats, orderDate, orderTime, orderItems } = req.body;

      // Add data inside the 'table_orders' table
      const [result] = await connection.execute(
          "INSERT INTO table_orders (total, seats, date, time) VALUES (?, ?, ?, ?)",
          [total, seats, orderDate, orderTime]
      );

      // Construct the SQL query dynamically
      let sql = `
      INSERT INTO order_items (online_order_id, table_order_id, menu_item_id, quantity)
      VALUES 
      `;

      // Generate placeholders for the values in the query
      const placeholders = orderItems.map(() => '(?, ?, ?, ?)').join(', ');

      // Append the placeholders to the SQL query
      sql += placeholders;

      // Generate an array of parameters for the query
      const params = orderItems.flatMap(item => [null, result.insertId, item.id, item.quantity]);

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


module.exports = router;