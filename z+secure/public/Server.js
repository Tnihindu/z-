// server.js (UPDATED FILE)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// --- Simulated Databases ---
const users = []; // For Login/Signup
const orders = []; // NEW: For Order Requests

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); 

// --- NEW Route for Handling Orders ---
app.post('/api/order', (req, res) => {
    const orderData = req.body;

    // Basic validation
    if (!orderData || !orderData.service_type) {
        return res.status(400).json({ success: false, message: 'Invalid order data.' });
    }

    // Add metadata (timestamp and unique ID)
    const newOrder = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...orderData 
    };

    // Store the order (In a real app, you'd insert this into a SQL or NoSQL database)
    orders.push(newOrder);
    
    console.log(`NEW ORDER RECEIVED: ${newOrder.service_type}`);
    console.log('Current total orders:', orders.length);

    // Success response
    res.status(200).json({ 
        success: true, 
        message: 'Your confidential order request has been submitted. We will contact you shortly.',
        orderId: newOrder.id 
    });
});

// Existing Signup and Login routes remain here...
// --- Routes ---

// 1. Signup Route
app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    // Check if user already exists
    if (users.find(u => u.username === username)) {
        return res.status(409).json({ success: false, message: 'User already exists.' });
    }

    // Store user (In a real app, you'd hash the password and store it in a DB)
    users.push({ username, password });
    console.log('New user signed up:', username);
    console.log('Current users:', users); // Log for verification

    // Success response
    res.status(201).json({ success: true, message: 'Signup successful!' });
});

// 2. Login Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Find the user
    const user = users.find(u => u.username === username);

    // Check if user exists and password matches
    if (user && user.password === password) {
        // In a real app, you would generate a JWT or session here
        return res.status(200).json({ success: true, message: 'Login successful!', username: user.username });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
});

// Default route to serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

