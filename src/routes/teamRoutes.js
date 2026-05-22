import express from 'express';
import { registerTeam, getTeams, getTeam, updateTeam, deleteTeam } from '../controllers/teamController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerTeam);
router.get('/', protect, getTeams);
router.get('/:id', protect, getTeam);
router.put('/:id', protect, adminOnly, updateTeam);
router.delete('/:id', protect, adminOnly, deleteTeam);

export default router;
