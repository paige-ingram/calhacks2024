import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Import the date-fns adapter to handle time scales

// Register required Chart.js elements
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

interface EmotionChartProps {
  data: { emotion: string; intensity: number; timestamp: string }[];
}

const EmotionChart: React.FC<EmotionChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => new Date(item.timestamp).toLocaleTimeString()), // X-axis (timestamps)
    datasets: [
      {
        label: 'Emotion Intensity',
        data: data.map((item) => ({ x: new Date(item.timestamp), y: item.intensity })), // Ensure each entry has x (time) and y (intensity)
        borderColor: '#4caf50', // Line color
        backgroundColor: 'rgba(76, 175, 80, 0.2)', // Fill color under the line
        pointRadius: 5, // Radius of data points
        pointBackgroundColor: '#388e3c',
        tension: 0.4, // Curve the line
        fill: true, // Fill the area under the line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensure chart is responsive
    plugins: {
      legend: {
        position: 'top' as const, // Ensure proper typing
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            // Ensure context.parsed.y is used as the number value
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2); // Round the values to 2 decimal places
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute', // Granularity of the X-axis labels
          tooltipFormat: 'MMM d, h:mm a', // Tooltip format
          displayFormats: {
            minute: 'h:mm a', // Display format for minute intervals
            hour: 'h:mm a', // Display format for hour intervals
          },
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Intensity',
        },
        ticks: {
          stepSize: 0.1, // Control the step size for better granularity
        },
      },
    },
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default EmotionChart;
