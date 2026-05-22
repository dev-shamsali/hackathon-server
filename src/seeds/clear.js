import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import Team from '../models/Team.js';
import Score from '../models/Score.js';
import Settings from '../models/Settings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function clear() {
  await connectDB();

  const [teams, scores] = await Promise.all([
    Team.deleteMany({}),
    Score.deleteMany({}),
    Settings.deleteMany({})
  ]);

  console.log(`Cleared ${teams.deletedCount} teams, ${scores.deletedCount} scores, settings reset.`);
  console.log('Database cleared. Admin and judge accounts preserved.');
  process.exit(0);
}

clear().catch(err => { console.error(err); process.exit(1); });
