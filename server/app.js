const express = require('express');
const app = express();
const cors = require('cors');
const port = 4300;

// Enable cors
app.use(cors());

// Middleware to parse JSON data
app.use(express.json());

// routes
const menuRoutes = require('./routes/menuRoutes');

// using the routes in different files
app.use('/menu', menuRoutes)

// start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});