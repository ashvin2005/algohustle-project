import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 300 });

const axiosInstance = axios.create({
  timeout: 10000,
});

router.get('/cf/:handle', async (req, res) => {
  try {
    const { handle } = req.params;
    const cacheKey = `cf:${handle}`;
    
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const [userInfo, userStatus, ratingHistory] = await Promise.all([
      axiosInstance.get(`https://codeforces.com/api/user.info?handles=${handle}`),
      axiosInstance.get(`https://codeforces.com/api/user.status?handle=${handle}`),
      axiosInstance.get(`https://codeforces.com/api/user.rating?handle=${handle}`)
    ]);

    const userData = userInfo.data.result[0];
    const submissions = userStatus.data.result;
    const ratings = ratingHistory.data.result;

    const result = {
      rating: userData.rating || 0,
      maxRating: userData.maxRating || 0,
      rank: userData.rank || 'unrated',
      problemsSolved: new Set(
        submissions
          .filter(sub => sub.verdict === 'OK')
          .map(sub => sub.problem.name)
      ).size,
      submissions: submissions.length,
      ratingHistory: ratings
    };

    cache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error('Codeforces API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch Codeforces data' });
  }
});

router.get('/lc/:handle', async (req, res) => {
  try {
    const { handle } = req.params;
    const cacheKey = `lc:${handle}`;
    
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const response = await axiosInstance.get(`https://leetcode-stats-api.herokuapp.com/${handle}`);
    const data = response.data;

    const result = {
      totalSolved: data.totalSolved,
      easySolved: data.easySolved,
      mediumSolved: data.mediumSolved,
      hardSolved: data.hardSolved,
      acceptanceRate: data.acceptanceRate,
      ranking: data.ranking
    };

    cache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error('LeetCode API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch LeetCode data' });
  }
});

router.get('/cf/search/:handle', async (req, res) => {
  try {
    const { handle } = req.params;
    const cacheKey = `cf-search:${handle}`;
    
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const response = await axiosInstance.get(`https://codeforces.com/api/user.info?handles=${handle}`);
    
    if (response.data.status === 'OK' && response.data.result.length > 0) {
      const userData = response.data.result[0];
      
      const result = {
        exists: true,
        id: userData.handle,
        username: userData.handle,
        displayName: userData.firstName && userData.lastName 
          ? `${userData.firstName} ${userData.lastName}` 
          : userData.handle,
        avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.handle}`,
        rating: userData.rating || 0,
        maxRating: userData.maxRating || 0,
        rank: userData.rank || 'unrated'
      };

      cache.set(cacheKey, result);
      res.json(result);
    } else {
      res.json({ exists: false, username: handle });
    }
  } catch (error) {
    console.error('Codeforces search error:', error.message);
    res.json({ exists: false, username: handle, error: error.message });
  }
});

export default router;
