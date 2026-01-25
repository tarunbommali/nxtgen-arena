const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const dsaProblemRoutes = require('./routes/dsaProblemRoutes');
const adminRoutes = require('./routes/adminRoutes');
const teamRoutes = require('./routes/teamRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
// const communicationRoutes = require('./routes/communicationRoutes'); // Email & Certificates (disabled temporarily)

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', submissionRoutes);
// app.use('/api/communication', communicationRoutes); // Disabled temporarily
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/dsasheets', dsaProblemRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'NxtGenLabs API is Running',
        version: '2.0.0'
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Server Error' });
});

module.exports = app;
