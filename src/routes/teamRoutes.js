import express from 'express';
import { registerTeam, getTeams, getTeam, deleteTeam } from '../controllers/teamController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/register', upload.fields([{ name: 'prd', maxCount: 1 }, { name: 'trd', maxCount: 1 }]), registerTeam);
router.get('/', protect, getTeams);
router.get('/:id', protect, getTeam);
router.delete('/:id', protect, adminOnly, deleteTeam);

export default router;
