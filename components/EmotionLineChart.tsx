// components/EmotionLineChart.tsx

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EmotionLineChartProps {
  data: { emotion: string; intensity: number; timestamp: string }[];
}

const EmotionLineChart: React.FC<EmotionLineChartProps> = ({ data }) => {
  // Prepare chart data
  const chartData = {
    labels: data.map((entry) =>
      new Date(entry.timestamp).toLocaleDateString()
    ), // X-axis labels (timestamps)
    datasets: [
      {
        label: 'Emotion Intensity',
        data: data.map((entry) => entry.intensity), // Y-axis values (intensities)
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Emotional Intensity Over Time',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Intensity',
        },
        min: 0,
        max: 1, // Assuming intensity ranges from 0 to 1
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default EmotionLineChart;
