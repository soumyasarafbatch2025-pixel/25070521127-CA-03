const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const listingRoutes = require('./routes/listingRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Development request logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().substring(11, 19);
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  res.status(200).json({
    status: 'ok',
    message: 'CampusLoop Lite API is running',
    timestamp: new Date().toISOString(),
    database: {
      status: states[dbState] || 'Unknown',
      readyState: dbState,
      name: mongoose.connection.name || 'campusloop_lite',
      host: mongoose.connection.host || 'localhost',
    },
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/listings', listingRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CampusLoop Lite API',
    endpoints: {
      health: '/api/health',
      listings: '/api/listings',
      stats: '/api/listings/meta/stats',
    },
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 CampusLoop Lite Server running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api/listings`);
  console.log(`💓 Health:   http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = { app, server };
