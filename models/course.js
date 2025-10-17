const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  instructor: String,
  seatsAvailable: { type: Number, default: 0 },
});

module.exports = mongoose.model('Course', courseSchema);