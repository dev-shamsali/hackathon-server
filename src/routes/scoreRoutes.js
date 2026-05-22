import express from 'express';
import { submitScore, getScores, getLeaderboard, getJudgeScores, getDraftScore } from '../controllers/scoreController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, submitScore);
router.get('/', protect, adminOnly, getScores);
router.get('/leaderboard', getLeaderboard);
router.get('/my', protect, getJudgeScores);
router.get('/draft/:teamId', protect, getDraftScore);

export default router;
