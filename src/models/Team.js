import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  teamId: { type: String, unique: true },
  teamName: { type: String, required: true, trim: true },
  leaderName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  members: [{ type: String, trim: true }],
  institute: { type: String, required: true, trim: true },
  projectTitle: { type: String, required: true, trim: true },
  problemStatement: { type: String, required: true },
  techStack: { type: String, required: true },
  prdUrl: { type: String, default: '' },
  trdUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

teamSchema.pre('save', async function (next) {
  if (!this.teamId) {
    const count = await mongoose.model('Team').countDocuments();
    this.teamId = `TEAM-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

export default mongoose.model('Team', teamSchema);
