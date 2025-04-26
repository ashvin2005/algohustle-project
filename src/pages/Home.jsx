import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [usernames, setUsernames] = useState({
    codeforces: '',
    leetcode: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard', { state: { usernames } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Algo<span className="text-indigo-600">hustle</span>
          </h1>
          <p className="text-xl text-gray-600">Track your competitive programming journey</p>
        </div>

        <div className="card p-8 backdrop-blur-sm bg-white/90">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="transform transition-all duration-200 hover:translate-x-1">
                <label htmlFor="codeforces" className="block text-sm font-medium text-gray-700">
                  Codeforces Username
                </label>
                <input
                  type="text"
                  id="codeforces"
                  className="input-field"
                  value={usernames.codeforces}
                  onChange={(e) => setUsernames({ ...usernames, codeforces: e.target.value })}
                  placeholder="Enter your Codeforces handle"
                />
              </div>

              <div className="transform transition-all duration-200 hover:translate-x-1">
                <label htmlFor="leetcode" className="block text-sm font-medium text-gray-700">
                  LeetCode Username
                </label>
                <input
                  type="text"
                  id="leetcode"
                  className="input-field"
                  value={usernames.leetcode}
                  onChange={(e) => setUsernames({ ...usernames, leetcode: e.target.value })}
                  placeholder="Enter your LeetCode handle"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Track My Progress
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}