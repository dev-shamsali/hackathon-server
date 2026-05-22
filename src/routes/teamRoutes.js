import express from 'express';
import { registerTeam, getTeams, getTeam, updateTeam, deleteTeam } from '../controllers/teamController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/register', (req, res, next) => {
  upload.fields([{ name: 'prd', maxCount: 1 }, { name: 'trd', maxCount: 1 }])(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, registerTeam);
router.get('/', protect, getTeams);
router.get('/:id', protect, getTeam);
router.put('/:id', protect, adminOnly, updateTeam);
router.delete('/:id', protect, adminOnly, deleteTeam);

export default router;
