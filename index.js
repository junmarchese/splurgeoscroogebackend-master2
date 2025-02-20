const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./config');  // Import Sequelize instance
const User = require('./src/models/User'); // Import User model

const priceRoutes = require('./src/routes/priceRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Fix: CORS configuration to allow frontend access
const corsOptions = {
  origin: "http://localhost:3000", // Allow frontend origin
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use('/api/prices', priceRoutes);
app.use('/api/auth', authRoutes);

// Database Sync
sequelize.sync()
  .then(() => console.log("Database Synced"))
  .catch(err => console.error("Database Sync Error:", err));

app.get('/', (req, res) => {
  res.send('Welcome to the Splurge-O-Scrooge API');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
