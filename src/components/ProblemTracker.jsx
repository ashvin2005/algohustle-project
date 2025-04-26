import { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ProblemTracker() {
  const [problems, setProblems] = useState({
    difficulty: {
      easy: 0,
      medium: 0,
      hard: 0
    },
    tags: {},
    timeAnalysis: {
      easy: [],
      medium: [],
      hard: []
    }
  });

  const [newProblem, setNewProblem] = useState({
    difficulty: 'easy',
    tags: [],
    time: 0,
    notes: ''
  });

  useEffect(() => {
    const savedProblems = localStorage.getItem('problems');
    if (savedProblems) {
      setProblems(JSON.parse(savedProblems));
    }
  }, []);

  const addProblem = () => {
    const updatedProblems = { ...problems };
    
    // Update difficulty count
    updatedProblems.difficulty[newProblem.difficulty]++;
    
    // Update tags
    newProblem.tags.forEach(tag => {
      updatedProblems.tags[tag] = (updatedProblems.tags[tag] || 0) + 1;
    });
    
    // Update time analysis
    updatedProblems.timeAnalysis[newProblem.difficulty].push(newProblem.time);
    
    setProblems(updatedProblems);
    localStorage.setItem('problems', JSON.stringify(updatedProblems));
    
    // Reset form
    setNewProblem({
      difficulty: 'easy',
      tags: [],
      time: 0,
      notes: ''
    });
  };

  const difficultyData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        label: 'Problems Solved',
        data: [
          problems.difficulty.easy,
          problems.difficulty.medium,
          problems.difficulty.hard
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ]
      }
    ]
  };

  const tagData = {
    labels: Object.keys(problems.tags),
    datasets: [
      {
        data: Object.values(problems.tags),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ]
      }
    ]
  };

  const calculateAverageTime = (difficulty) => {
    const times = problems.timeAnalysis[difficulty];
    if (times.length === 0) return 0;
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Add New Problem</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
            <select
              value={newProblem.difficulty}
              onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              type="text"
              value={newProblem.tags.join(', ')}
              onChange={(e) => setNewProblem({ ...newProblem, tags: e.target.value.split(',').map(tag => tag.trim()) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., DP, Graph, Greedy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Time (minutes)</label>
            <input
              type="number"
              value={newProblem.time}
              onChange={(e) => setNewProblem({ ...newProblem, time: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={newProblem.notes}
              onChange={(e) => setNewProblem({ ...newProblem, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows="3"
            />
          </div>

          <button
            onClick={addProblem}
            className="btn-primary"
          >
            Add Problem
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Difficulty Distribution</h3>
          <div className="h-64">
            <Bar data={difficultyData} options={{
              responsive: true,
              maintainAspectRatio: false
            }} />
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Tag Distribution</h3>
          <div className="h-64">
            <Doughnut data={tagData} options={{
              responsive: true,
              maintainAspectRatio: false
            }} />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Time Analysis</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{calculateAverageTime('easy')} min</p>
            <p className="text-sm text-gray-600">Average (Easy)</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{calculateAverageTime('medium')} min</p>
            <p className="text-sm text-gray-600">Average (Medium)</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{calculateAverageTime('hard')} min</p>
            <p className="text-sm text-gray-600">Average (Hard)</p>
          </div>
        </div>
      </div>
    </div>
  );
} 