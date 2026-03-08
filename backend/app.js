const express = require('express');
const cookieParser = require('cookie-parser'); 
const cors = require('cors'); 
const authRoutes = require('./src/routes/authRoutes'); 
const errorHandler = require('./src/middleware/error.middleware'); 

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', 
    credentials: true, 
}));
app.use(express.json()); 
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;