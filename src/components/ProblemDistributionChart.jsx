import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

export default function ProblemDistributionChart({ stats }) {
  const data = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [stats.easySolved, stats.mediumSolved, stats.hardSolved],
        backgroundColor: [
          'rgba(72, 187, 120, 0.7)',
          'rgba(237, 137, 54, 0.7)',
          'rgba(229, 62, 62, 0.7)',
        ],
        borderColor: [
          'rgb(72, 187, 120)',
          'rgb(237, 137, 54)',
          'rgb(229, 62, 62)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Problem Difficulty Distribution',
      },
    },
  };

  return (
    <div className="w-full h-64">
      <Pie data={data} options={options} />
    </div>
  );
}