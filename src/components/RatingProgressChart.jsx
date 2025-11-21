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

export default function RatingProgressChart({ ratingHistory }) {
  // Filter out invalid timestamps and sort by date
  const validHistory = ratingHistory
    .filter(entry => entry.timestamp && !isNaN(new Date(entry.timestamp * 1000).getTime()))
    .sort((a, b) => a.timestamp - b.timestamp);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const data = {
    labels: validHistory.map(entry => formatDate(entry.timestamp)),
    datasets: [
      {
        label: 'Rating',
        data: validHistory.map(entry => entry.newRating),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            const entry = validHistory[context.dataIndex];
            const date = new Date(entry.timestamp * 1000);
            const fullDate = date.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            });
            return [
              `Rating: ${context.parsed.y}`,
              `Date: ${fullDate}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'Rating',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 0,
          font: {
            size: 12
          },
          callback: function(value, index) {
            // Show every nth label to prevent overcrowding
            const n = Math.ceil(validHistory.length / 8);
            return index % n === 0 ? this.getLabelForValue(value) : '';
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="w-full h-80 bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Progress</h3>
      <div className="w-full h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}