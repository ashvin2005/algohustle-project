import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { db } from '../config/db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { codeforces, leetcode } = req.body;

    if (!codeforces && !leetcode) {
      return res.status(400).json({ error: 'At least one username is required' });
    }

    if (codeforces) {
      try {
        const response = await axios.get(
          `https://codeforces.com/api/user.info?handles=${codeforces}`,
          { timeout: 5000 }
        );
        if (response.data.status !== 'OK') {
          return res.status(400).json({ error: `Codeforces user "${codeforces}" not found` });
        }
      } catch (error) {
        return res.status(400).json({ error: `Codeforces user "${codeforces}" not found` });
      }
    }

    const userId = codeforces || leetcode;
    const userProfile = {
      id: userId,
      codeforces: codeforces || null,
      leetcode: leetcode || null,
      displayName: codeforces || leetcode,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    await db.users.set(userId, userProfile);

    const token = jwt.sign(
      { userId, codeforces, leetcode },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      success: true, 
      token, 
      user: userProfile 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/verify', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ valid: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.users.get(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ valid: false });
    }

    res.json({ valid: true, user });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

export default router;
