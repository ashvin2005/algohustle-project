import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../config/db.js';

const router = express.Router();

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.users.get(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { displayName } = req.body;
    const updateData = {
      ...(displayName && { displayName }),
      lastActive: new Date().toISOString()
    };

    const user = await db.users.update(req.user.userId, updateData);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const user = await db.users.get(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { lastActive, ...publicData } = user;
    res.json({ user: publicData });
  } catch (error) {
    console.error('Public profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
