const express = require('express');
const Course = require('../models/course');
const Registration = require('../models/registration');

const router = express.Router();

// List all courses
router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.render('courses', { courses, user: req.session.user });
});

// Register for a course
router.post('/register-course', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Please login first');
  }

  const { courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      req.session.message = 'Course not found.';
      return res.redirect('/dashboard');
    }

    // Check if already registered
    const existing = await Registration.findOne({
      user: req.session.user._id,
      course: courseId
    });

    if (existing) {
      req.session.message = 'You have already registered for this course.';
      return res.redirect('/dashboard');
    }

    // Check seat availability
    if (course.seatsAvailable <= 0) {
      req.session.message = 'No seats available for this course.';
      return res.redirect('/dashboard');
    }

    // Register the course
    const registration = new Registration({
      user: req.session.user._id,
      course: courseId
    });

    await registration.save();

    // Decrease seat count
    course.seatsAvailable -= 1;
    await course.save();

    req.session.message = `Successfully registered for ${course.title}.`;
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Course registration error:', err);
    req.session.message = 'Server error during registration.';
    res.redirect('/dashboard');
  }
});

module.exports = router;