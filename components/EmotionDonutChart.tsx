import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface EmotionDonutChartProps {
  data: { emotion: string; intensity: number }[];
}

const EmotionDonutChart: React.FC<EmotionDonutChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.emotion), // Set emotion names as labels
    datasets: [
      {
        label: 'Emotion Intensity',
        data: data.map((item) => item.intensity), // Set intensity values
        backgroundColor: ['#f1c40f', '#cd7f32', '#e74c3c', '#3498db'], // Colors for emotions
        borderColor: ['#f39c12', '#b87333', '#e74c3c', '#2980b9'], // Borders for each color
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed.toFixed(2);
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default EmotionDonutChart;
