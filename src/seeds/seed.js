import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import Admin from '../models/Admin.js';
import Judge from '../models/Judge.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function seed() {
  await connectDB();

  // Admin account
  const adminEmail = 'dev.shamsali@gmail.com';
  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (existingAdmin) {
    existingAdmin.name = 'Shams Ali';
    existingAdmin.password = 'shams@123';
    await existingAdmin.save();
    console.log('Admin updated:', adminEmail);
  } else {
    await Admin.create({ name: 'Shams Ali', email: adminEmail, password: 'shams@123' });
    console.log('Admin created:', adminEmail);
  }

  // Judge account
  const judgeEmail = 'shams@gmail.com';
  const existingJudge = await Judge.findOne({ email: judgeEmail });
  if (existingJudge) {
    existingJudge.name = 'Shams';
    existingJudge.password = 'shams@123';
    await existingJudge.save();
    console.log('Judge updated:', judgeEmail);
  } else {
    await Judge.create({ name: 'Shams', email: judgeEmail, password: 'shams@123' });
    console.log('Judge created:', judgeEmail);
  }

  console.log('Seed complete.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
