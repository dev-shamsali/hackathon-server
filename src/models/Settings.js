import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  scoringLocked: { type: Boolean, default: false },
  hackathonName: { type: String, default: 'Hackathon 2024' },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Settings', settingsSchema);
