import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  judgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Judge', required: true },
  problemSolving: { type: Number, min: 0, max: 20, required: true },
  technicalImplementation: { type: Number, min: 0, max: 20, required: true },
  innovation: { type: Number, min: 0, max: 20, required: true },
  uiux: { type: Number, min: 0, max: 15, required: true },
  presentation: { type: Number, min: 0, max: 10, required: true },
  scalability: { type: Number, min: 0, max: 10, required: true },
  documentation: { type: Number, min: 0, max: 5, required: true },
  notes: { type: String, default: '' },
  totalScore: { type: Number },
  isDraft: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now }
});

scoreSchema.pre('save', function (next) {
  this.totalScore =
    this.problemSolving +
    this.technicalImplementation +
    this.innovation +
    this.uiux +
    this.presentation +
    this.scalability +
    this.documentation;
  next();
});

export default mongoose.model('Score', scoreSchema);
