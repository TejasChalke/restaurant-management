const mysql = require('mysql2');

const menuItemsData =
[
    {
        "image": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=1884&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Butter Chicken",
        "description": "Tender chicken cooked in a rich, creamy tomato-based curry with butter and various spices.",
        "price": "320",
        "status": "available",
        "tags": "lunch, dinner"
    },
    {
        "image": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Biryani",
        "description": "Fragrant and flavorful rice dish cooked with aromatic spices, basmati rice, and meat (chicken, mutton, or beef).",
        "price": "380",
        "status": "available",
        "tags": "lunch, dinner"
    },
    {
        "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=1917&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Paneer Tikka",
        "description": "Marinated and grilled cubes of paneer (Indian cottage cheese) served with mint chutney.",
        "price": "280",
        "status": "available",
        "tags": "lunch, dinner"
    },
    {
        "image": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Masala Dosa",
        "description": "Thin and crispy fermented rice crepe filled with spiced mashed potatoes, served with coconut chutney and sambar.",
        "price": "80",
        "status": "available",
        "tags": "snacks, breakfast"
    },
    {
        "image": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Rogan Josh",
        "description": "Slow-cooked aromatic curry with tender pieces of meat (usually lamb or goat) in a rich and flavorful sauce.",
        "price": "300",
        "status": "available",
        "tags": "lunch, dinner"
    },
    {
        "image": "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=1930&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Chole Bhature",
        "description": "Spicy chickpea curry served with deep-fried bread (bhatura) made from fermented dough.",
        "price": "195",
        "status": "available",
        "tags": "lunch, dinner"
    },
    {
        "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Samosa",
        "description": "Triangular pastry filled with spiced potatoes, peas, and sometimes meat, deep-fried until golden brown.",
        "price": "22",
        "status": "available",
        "tags": "snacks, breakfast"
    },
    {
        "image": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=1900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Chicken Tikka Masala",
        "description": "Grilled chicken tikka pieces in a creamy tomato-based curry sauce with aromatic spices.",
        "price": "350",
        "status": "available",
        "tags": "lunch, dinner"
    },
    {
        "image": "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Dhokla",
        "description": "Steamed and spongy cake made from fermented rice and chickpea flour, typically served as a snack or breakfast.",
        "price": "55",
        "status": "available",
        "tags": "snacks, breakfast"
    },
    {
        "image": "https://images.unsplash.com/photo-1574448857443-dc1d7e9c4dad?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Aloo Paratha",
        "description": "Stuffed Indian flatbread with spiced mashed potatoes, pan-fried until golden and served with yogurt or chutney.",
        "price": "65",
        "status": "available",
        "tags": "lunch, dinner, snacks, breakfast"
    }
]

// MySQL database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test_restaurant',
};

// Create a connection pool
const pool = mysql.createPool(dbConfig).promise();

// Functions to insert data into the MySQL table
async function insertDataIntoMenuItemsTable(dish) {
    try {
        const [rows, fields] = await pool.execute(
            'INSERT INTO menu_items (image, name, description, price, status, tags) VALUES (?, ?, ?, ?, ?, ?)',
            [dish.image, dish.name, dish.description, dish.price, dish.status, dish.tags]
        );

        console.log(`Inserted dish ${dish.name} with ID ${rows.insertId}`);
    } catch (error) {
        console.error('Error inserting data into the table:', error.message);
    }
}

async function startMenuItemInsertion(){
    try{
        // Call the function with your data
        for (const dish of data) {
            await insertDataIntoMenuItemsTable(dish);
        }
    }finally{
        pool.end()
    }
}

// startMenuItemInsertion();