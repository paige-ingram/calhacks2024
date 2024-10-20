import React, { useEffect } from 'react';
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

// Function to generate a range of colors between two given colors
const generateGradientColors = (startColor: string, endColor: string, steps: number) => {
  const start = parseInt(startColor.slice(1), 16);
  const end = parseInt(endColor.slice(1), 16);
  const startR = (start >> 16) & 255;
  const startG = (start >> 8) & 255;
  const startB = start & 255;
  const endR = (end >> 16) & 255;
  const endG = (end >> 8) & 255;
  const endB = end & 255;

  const colors = [];

  for (let i = 0; i < steps; i++) {
    const r = Math.round(startR + ((endR - startR) * i) / (steps - 1));
    const g = Math.round(startG + ((endG - startG) * i) / (steps - 1));
    const b = Math.round(startB + ((endB - startB) * i) / (steps - 1));
    colors.push(`#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`);
  }

  return colors;
};

interface EmotionDonutChartProps {
  data: { emotion: string; intensity: number }[];
}

const EmotionDonutChart: React.FC<EmotionDonutChartProps> = ({ data }) => {
  // Generate only 4 distinct colors from the gradient
  const gradientColors = generateGradientColors('#0084FF', '#8400FF', 4);

  const chartData = {
    labels: data.map((item) => item.emotion), // Set emotion names as labels
    datasets: [
      {
        label: 'Emotion Intensity',
        data: data.map((item) => item.intensity), // Set intensity values
        backgroundColor: gradientColors, // Apply gradient colors
        borderColor: gradientColors.map(color => color), // Same colors for border
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

  // useEffect to cleanup chart instance
  useEffect(() => {
    return () => {
      // Destroy chart instance when the component is unmounted
      ChartJS.getChart('doughnut-chart')?.destroy();
    };
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Doughnut id="doughnut-chart" data={chartData} options={options} />
    </div>
  );
};

export default EmotionDonutChart;
