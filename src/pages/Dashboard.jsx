import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getCodeforcesStats, getLeetCodeStats } from '../utils/api';
import ProblemDistributionChart from '../components/ProblemDistributionChart';
import RatingProgressChart from '../components/RatingProgressChart';
import Goals from '../components/Goals';
import ProblemTracker from '../components/ProblemTracker';

export default function Dashboard() {
  const { state } = useLocation();
  const { usernames } = state || {};
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchStats() {
      try {
        const statsPromises = {
          codeforces: usernames.codeforces ? getCodeforcesStats(usernames.codeforces) : null,
          leetcode: usernames.leetcode ? getLeetCodeStats(usernames.leetcode) : null
        };

        const results = await Promise.all(Object.values(statsPromises));
        const platforms = Object.keys(statsPromises);
        
        const newStats = platforms.reduce((acc, platform, index) => {
          acc[platform] = results[index];
          return acc;
        }, {});

        setStats(newStats);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user statistics');
        setLoading(false);
      }
    }

    if (usernames) {
      fetchStats();
    }
  }, [usernames]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-6 text-lg text-gray-600">Fetching your achievements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center p-8 card max-w-md">
          <p className="text-red-600 text-lg">{error}</p>
          <div className="mt-6 space-y-4">
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Try Again
            </button>
            <Link to="/" className="block text-indigo-600 hover:text-indigo-700 font-medium">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">
                  Algo<span className="text-indigo-600">hustle</span>
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Change Usernames
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Your Coding Progress</h1>
            <p className="text-gray-600">Track your performance across different platforms</p>
          </div>

          <div className="mb-8">
            <nav className="flex space-x-4" aria-label="Tabs">
              {['overview', 'goals', 'problems'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
          
          {activeTab === 'overview' && (
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
                {Object.entries(stats).map(([platform, platformStats]) => {
                  if (!platformStats) return null;
                  
                  return (
                    <div key={platform} className="card p-6 transform transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold text-gray-900 capitalize">{platform}</h3>
                          <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                            Active
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          @{usernames[platform]}
                        </div>
                      </div>

                      <div className="space-y-6">
                        {platform === 'codeforces' && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="stat-value text-indigo-600">{platformStats.rating}</p>
                                <p className="stat-label">Current Rating</p>
                              </div>
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="stat-value text-green-600">{platformStats.maxRating}</p>
                                <p className="stat-label">Max Rating</p>
                              </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="stat-value capitalize text-purple-600">{platformStats.rank}</p>
                              <p className="stat-label">Current Rank</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="stat-value text-blue-600">{platformStats.problemsSolved}</p>
                              <p className="stat-label">Problems Solved</p>
                            </div>
                            {platformStats.ratingHistory && platformStats.ratingHistory.length > 0 && (
                              <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
                                <h4 className="text-sm font-medium text-gray-700 mb-4">Rating Progress</h4>
                                <RatingProgressChart ratingHistory={platformStats.ratingHistory} />
                              </div>
                            )}
                          </>
                        )}
                        {platform === 'leetcode' && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="stat-value text-indigo-600">{platformStats.totalSolved}</p>
                                <p className="stat-label">Total Solved</p>
                              </div>
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="stat-value text-green-600">{platformStats.acceptanceRate}%</p>
                                <p className="stat-label">Acceptance Rate</p>
                              </div>
                            </div>
                            <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
                              <h4 className="text-sm font-medium text-gray-700 mb-4">Problem Distribution</h4>
                              <ProblemDistributionChart stats={platformStats} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'goals' && <Goals />}
          {activeTab === 'problems' && <ProblemTracker />}
        </div>
      </main>
    </div>
  );
}