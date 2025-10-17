const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();
const Registration = require('../models/registration');
const Course = require('../models/course');


// ✅ Show registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// ✅ Show login form
router.get('/login', (req, res) => {
  res.render('login');
});

// 🔐 Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('All fields are required');
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email: normalizedEmail,
      password: hashedPassword
    });

    await newUser.save();
    req.session.user = newUser;
    res.redirect('/courses');
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Server error');
  }
});

// 🔐 Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    req.session.user = user;
    res.redirect('/courses');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
});

// 🚪 Logout
router.get('/logout', (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect('/');
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).send('Logout failed');
  }
});

// 🏠 Dashboard

router.get('/dashboard', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const registrations = await Registration.find({ user: req.session.user._id }).populate('course');
    const message = req.session.message || null;
    req.session.message = null; // Clear after displaying

    res.render('dashboard', {
      username: req.session.user.username,
      registeredCourses: registrations.map(r => r.course),
      message
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send('Server error');
  }
});


module.exports = router;