const express = require('express');
const cookieParser = require('cookie-parser'); 
const cors = require('cors'); 
const path = require('path');
const errorHandler = require('./src/middleware/error.middleware'); 

const authRoutes = require('./src/routes/authRoutes');
const themeRoutes = require('./src/routes/themeRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const lessonRoutes = require('./src/routes/lessonRoutes');
const trainerStudentRoutes = require('./src/routes/trainerStudentRoutes');
const userProgressRoutes = require('./src/routes/userProgressRoutes');
const favoriteRoutes = require('./src/routes/favoriteRoutes');

const taskRoutes = require('./src/routes/taskRoutes');
const gameRoutes = require('./src/routes/gameRoutes');
const analysisRoutes = require('./src/routes/analysisRoutes');
const assignedCourseRoutes = require('./src/routes/assignedCourseRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const reportRoutes = require('./src/routes/reportRoutes');

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', 
    credentials: true, 
}));
app.use(express.json()); 
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/trainer', trainerStudentRoutes);
app.use('/api/progress', userProgressRoutes);
app.use('/api/favorites', favoriteRoutes);

app.use('/api/tasks', taskRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/assigned-courses', assignedCourseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;