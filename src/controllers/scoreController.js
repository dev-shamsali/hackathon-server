import Score from '../models/Score.js';
import Team from '../models/Team.js';
import { calculateWinners } from '../utils/winnerCalc.js';
import Settings from '../models/Settings.js';

export const submitScore = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (settings?.scoringLocked) return res.status(403).json({ message: 'Scoring is locked' });

    const { teamId, problemSolving, technicalImplementation, innovation, uiux, presentation, scalability, documentation, notes, isDraft } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const existing = await Score.findOne({ teamId, judgeId: req.user._id, isDraft: false });
    if (existing && !isDraft) return res.status(400).json({ message: 'Score already submitted for this team' });

    let score;
    const draft = await Score.findOne({ teamId, judgeId: req.user._id, isDraft: true });

    const scoreData = {
      teamId, judgeId: req.user._id,
      problemSolving: Number(problemSolving),
      technicalImplementation: Number(technicalImplementation),
      innovation: Number(innovation),
      uiux: Number(uiux),
      presentation: Number(presentation),
      scalability: Number(scalability),
      documentation: Number(documentation),
      notes: notes || '',
      isDraft: isDraft || false
    };

    if (draft) {
      Object.assign(draft, scoreData);
      score = await draft.save();
    } else {
      score = await Score.create(scoreData);
    }

    res.status(201).json({ message: isDraft ? 'Draft saved' : 'Score submitted', score });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getScores = async (req, res) => {
  try {
    const scores = await Score.find({ isDraft: false })
      .populate('teamId', 'teamName projectTitle teamId')
      .populate('judgeId', 'name email');
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const scores = await Score.find({ isDraft: false })
      .populate('teamId', 'teamName projectTitle teamId institute');
    const { rankings, specialAwards } = calculateWinners(scores);
    res.json({ rankings, specialAwards });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getJudgeScores = async (req, res) => {
  try {
    const scores = await Score.find({ judgeId: req.user._id })
      .populate('teamId', 'teamName projectTitle teamId');
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDraftScore = async (req, res) => {
  try {
    const draft = await Score.findOne({ teamId: req.params.teamId, judgeId: req.user._id, isDraft: true });
    res.json(draft || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
