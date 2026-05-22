import express from 'express';
import {
  createJudge, getJudges, deleteJudge, toggleJudge,
  getResults, lockScoring, getSettings, getAnalytics, setupAdmin
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/setup', setupAdmin);
router.get('/settings', protect, adminOnly, getSettings);
router.get('/analytics', protect, adminOnly, getAnalytics);
router.get('/results', protect, adminOnly, getResults);
router.post('/lock-scoring', protect, adminOnly, lockScoring);
router.post('/judges', protect, adminOnly, createJudge);
router.get('/judges', protect, adminOnly, getJudges);
router.delete('/judges/:id', protect, adminOnly, deleteJudge);
router.patch('/judges/:id/toggle', protect, adminOnly, toggleJudge);

export default router;
