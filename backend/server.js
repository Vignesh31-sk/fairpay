const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config({ path: './config.env' });

// Import database connection
const hanaConnection = require('./database/hanaConnection');

// Import routes
const authRoutes = require('./routes/auth');
const personalDataRoutes = require('./routes/personalData');
const kycRoutes = require('./routes/kyc');
const jobsRoutes = require('./routes/jobs');
const walletRoutes = require('./routes/wallet');
const notificationsRoutes = require('./routes/notifications');
const grievancesRoutes = require('./routes/grievances');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8081',
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'FairPay Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/personal-data', personalDataRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/grievances', grievancesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    console.log('🔌 Testing SAP HANA connection...');
    const isConnected = await hanaConnection.testConnection();
    
    if (!isConnected) {
      console.error('❌ Failed to connect to SAP HANA. Please check your connection parameters.');
      process.exit(1);
    }

    // Initialize database tables
    console.log('📊 Initializing database tables...');
    await hanaConnection.initializeTables();

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
🚀 FairPay Backend Server Started!
📍 Server: http://0.0.0.0:${PORT}
🔗 Health Check: http://0.0.0.0:${PORT}/health
📱 API Base URL: http://0.0.0.0:${PORT}/api
🌍 Environment: ${process.env.NODE_ENV || 'development'}
⏰ Started at: ${new Date().toISOString()}
      `);
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  try {
    await hanaConnection.closeAllConnections();
    console.log('✅ Server shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  try {
    await hanaConnection.closeAllConnections();
    console.log('✅ Server shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer(); 