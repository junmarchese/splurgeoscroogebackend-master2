const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: process.env.NODE_ENV === "production" ? { ssl: { rejectUnauthorized: false } } : {},
});

const JWT_SECRET = process.env.JWT_SECRET || "secret-dev";
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
  sequelize,
  JWT_SECRET,
  PORT: process.env.PORT || 5000,
  BCRYPT_WORK_FACTOR
};
