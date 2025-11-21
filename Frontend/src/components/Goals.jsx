import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Goals() {
  const [goals, setGoals] = useState({
    daily: 5,
    weekly: 35,
    currentStreak: 0,
    longestStreak: 0
  });

  const [progress, setProgress] = useState({
    daily: 0,
    weekly: 0
  });

  const [goalHistory, setGoalHistory] = useState([]);

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    const savedProgress = localStorage.getItem('progress');
    const savedHistory = localStorage.getItem('goalHistory');

    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedProgress) setProgress(JSON.parse(savedProgress));
    if (savedHistory) setGoalHistory(JSON.parse(savedHistory));
  }, []);

  const updateGoal = (type, value) => {
    const newGoals = { ...goals, [type]: value };
    setGoals(newGoals);
    localStorage.setItem('goals', JSON.stringify(newGoals));
  };

  const updateProgress = (type, value) => {
    const newProgress = { ...progress, [type]: value };
    setProgress(newProgress);
    localStorage.setItem('progress', JSON.stringify(newProgress));

    const today = new Date().toISOString().split('T')[0];
    const newHistory = [...goalHistory, { date: today, progress: value }];
    setGoalHistory(newHistory);
    localStorage.setItem('goalHistory', JSON.stringify(newHistory));
  };

  const chartData = {
    labels: goalHistory.map(item => item.date),
    datasets: [
      {
        label: 'Daily Progress',
        data: goalHistory.map(item => item.progress),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Daily Goals</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Problems per day</label>
              <input
                type="number"
                value={goals.daily}
                onChange={(e) => updateGoal('daily', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Progress: {progress.daily}/{goals.daily}</span>
              <button
                onClick={() => updateProgress('daily', Math.min(progress.daily + 1, goals.daily))}
                className="btn-primary"
              >
                +1 Problem
              </button>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Weekly Goals</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Problems per week</label>
              <input
                type="number"
                value={goals.weekly}
                onChange={(e) => updateGoal('weekly', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Progress: {progress.weekly}/{goals.weekly}</span>
              <button
                onClick={() => updateProgress('weekly', Math.min(progress.weekly + 1, goals.weekly))}
                className="btn-primary"
              >
                +1 Problem
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Progress History</h3>
        <div className="h-64">
          <Line data={chartData} options={{
            responsive: true,
            maintainAspectRatio: false
          }} />
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Streaks</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-indigo-600">{goals.currentStreak}</p>
            <p className="text-sm text-gray-600">Current Streak</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{goals.longestStreak}</p>
            <p className="text-sm text-gray-600">Longest Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
} 