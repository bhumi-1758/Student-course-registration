const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/course');
const User = require('./models/user');

dotenv.config();

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Sample courses
    const courses = [
      {
        title: 'Java Fundamentals',
        description: 'Learn the basics of Java programming.',
        instructor: 'Alice Johnson',
        seatsAvailable: 20
      },
      {
        title: 'Full-Stack Web Development',
        description: 'Build modern web apps using Node.js and MongoDB.',
        instructor: 'Bob Smith',
        seatsAvailable: 15
      },
      {
        title: 'Data Structures & Algorithms',
        description: 'Master competitive programming techniques.',
        instructor: 'Bhumika Garg',
        seatsAvailable: 10
      }
    ];

    // Sample admin user
    const adminUser = {
      username: 'admin',
      email: 'admin@example.com',
      password: await require('bcryptjs').hash('admin123', 10),
      role: 'admin'
    };

    await Course.deleteMany({});
    await User.deleteMany({});

    await Course.insertMany(courses);
    await User.create(adminUser);

    console.log('🌱 Sample data seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
}

seedData();