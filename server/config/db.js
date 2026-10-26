const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusloop_lite';
    
    console.log(`[Database] Attempting connection to MongoDB at: ${mongoUri.replace(/:([^@]+)@/, ':****@')}`);
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if server isn't reachable
    });

    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failed: ${error.message}`);
    console.error(`[Database Help] Ensure MongoDB service is running (e.g., via MongoDB Compass or 'mongod')`);
    console.error(`[Database Help] You can configure MONGO_URI in backend/.env`);
    // Do not crash the entire node process immediately so helpful status endpoints remain reachable
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] Mongoose connection disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] Mongoose reconnected to MongoDB.');
});

module.exports = connectDB;
