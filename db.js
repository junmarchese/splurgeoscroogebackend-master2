const { Pool } = require("pg");
const { sequelize } = require("./config/config");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Ensure connection works
sequelize.authenticate()
  .then(() => console.log("✅ Connected to database"))
  .catch(err => console.error("🔴 Database connection error:", err));

module.exports = { sequelize, query: (text, params) => pool.query(text, params) };
