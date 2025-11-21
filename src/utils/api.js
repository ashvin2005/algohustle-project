import axios from 'axios';

const CODEFORCES_API = 'https://codeforces.com/api';
const LEETCODE_API = 'https://leetcode-stats-api.herokuapp.com';

export async function getCodeforcesStats(username) {
  try {
    const [userInfo, userStatus, ratingHistory] = await Promise.all([
      axios.get(`${CODEFORCES_API}/user.info?handles=${username}`),
      axios.get(`${CODEFORCES_API}/user.status?handle=${username}`),
      axios.get(`${CODEFORCES_API}/user.rating?handle=${username}`)
    ]);

    const userData = userInfo.data.result[0];
    const submissions = userStatus.data.result;
    const ratings = ratingHistory.data.result;

    return {
      rating: userData.rating || 0,
      maxRating: userData.maxRating || 0,
      rank: userData.rank || 'unrated',
      problemsSolved: new Set(submissions.filter(sub => sub.verdict === 'OK').map(sub => sub.problem.name)).size,
      submissions: submissions.length,
      ratingHistory: ratings
    };
  } catch (error) {
    console.error('Codeforces API Error:', error);
    return null;
  }
}

export async function getLeetCodeStats(username) {
  try {
    const response = await axios.get(`${LEETCODE_API}/${username}`);
    const data = response.data;

    return {
      totalSolved: data.totalSolved,
      easySolved: data.easySolved,
      mediumSolved: data.mediumSolved,
      hardSolved: data.hardSolved,
      acceptanceRate: data.acceptanceRate,
      ranking: data.ranking
    };
  } catch (error) {
    console.error('LeetCode API Error:', error);
    return null;
  }
}