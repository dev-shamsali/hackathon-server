import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import Admin from '../models/Admin.js';

dotenv.config({ path: '../../.env' });

const seed = async () => {
  await connectDB();
  const existing = await Admin.findOne({ email: 'admin@hackathon.com' });
  if (!existing) {
    await Admin.create({ name: 'Admin', email: 'admin@hackathon.com', password: 'admin123' });
    console.log('Admin created: admin@hackathon.com / admin123');
  } else {
    console.log('Admin already exists');
  }
  process.exit(0);
};

seed();
