const express = require('express');
const Course = require('../models/course');
const router = express.Router();

// Show course creation form
router.get('/create-course', (req, res) => {
  res.render('create-course');
});

// Handle course creation
router.post('/create-course', async (req, res) => {
  const { title, description, instructor, seatsAvailable } = req.body;

  if (!title || !instructor || !seatsAvailable) {
    return res.send('All required fields must be filled.');
  }

  try {
    const course = new Course({ title, description, instructor, seatsAvailable });
    await course.save();
    res.redirect('/admin/courses');
  } catch (err) {
    console.error('Course creation error:', err);
    res.status(500).send('Server error');
  }
});

// View all courses
router.get('/courses', async (req, res) => {
  const courses = await Course.find();
  res.render('admin-courses', { courses });
});

// Delete a course
router.post('/delete-course', async (req, res) => {
  const { courseId } = req.body;
  try {
    await Course.findByIdAndDelete(courseId);
    res.redirect('/admin/courses');
  } catch (err) {
    console.error('Course deletion error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;