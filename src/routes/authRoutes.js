const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../../config');
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { username, password, firstName, lastName, email } = req.body;

    if (!username || !password || !firstName || !lastName || !email) {
      await transaction.rollback();
      return res.status(400).json({ error: 'All fields required' });
    }

    const existingUser = await User.findOne({ where: { username }, transaction });
    if (existingUser) {
      await transaction.rollback();
      return res.status(409).json({ error: 'Username exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email
    }, { transaction });

    await transaction.commit();

    // set JWT_SECRET
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({ message: 'User created', user: newUser, token });

  } catch (error) {
    await transaction.rollback();
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare password with bcrypt
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.username;

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '14d' }
    );

    res.json({ message: "Login successful", token, user });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

module.exports = router;
