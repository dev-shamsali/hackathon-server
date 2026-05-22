import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const judgeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'judge' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

judgeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

judgeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Judge', judgeSchema);
