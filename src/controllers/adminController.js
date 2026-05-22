import Judge from '../models/Judge.js';
import Admin from '../models/Admin.js';
import Score from '../models/Score.js';
import Team from '../models/Team.js';
import Settings from '../models/Settings.js';
import { calculateWinners } from '../utils/winnerCalc.js';

export const createJudge = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Judge.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Judge already exists' });
    const judge = await Judge.create({ name, email, password });
    res.status(201).json({ message: 'Judge created', judge: { id: judge._id, name: judge.name, email: judge.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getJudges = async (req, res) => {
  try {
    const judges = await Judge.find().select('-password').sort({ createdAt: -1 });
    res.json(judges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteJudge = async (req, res) => {
  try {
    await Judge.findByIdAndDelete(req.params.id);
    res.json({ message: 'Judge deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleJudge = async (req, res) => {
  try {
    const judge = await Judge.findById(req.params.id);
    if (!judge) return res.status(404).json({ message: 'Judge not found' });
    judge.isActive = !judge.isActive;
    await judge.save();
    res.json({ message: `Judge ${judge.isActive ? 'activated' : 'deactivated'}`, isActive: judge.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getResults = async (req, res) => {
  try {
    const scores = await Score.find({ isDraft: false })
      .populate('teamId', 'teamName projectTitle teamId institute leaderName')
      .populate('judgeId', 'name email');
    const { rankings, specialAwards } = calculateWinners(scores);
    res.json({ rankings, specialAwards, scores });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const lockScoring = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    settings.scoringLocked = !settings.scoringLocked;
    settings.updatedAt = new Date();
    await settings.save();
    res.json({ locked: settings.scoringLocked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const [teams, judges, scores] = await Promise.all([
      Team.countDocuments(),
      Judge.countDocuments(),
      Score.countDocuments({ isDraft: false })
    ]);
    const allScores = await Score.find({ isDraft: false });
    const avgScore = allScores.length
      ? (allScores.reduce((a, b) => a + b.totalScore, 0) / allScores.length).toFixed(1)
      : 0;
    res.json({ teams, judges, scores, avgScore });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const setupAdmin = async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;
    if (secretKey !== process.env.ADMIN_SECRET_KEY)
      return res.status(403).json({ message: 'Invalid secret key' });
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });
    const admin = await Admin.create({ name, email, password });
    res.status(201).json({ message: 'Admin created', id: admin._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
