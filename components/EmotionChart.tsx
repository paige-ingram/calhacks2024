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
  TimeScale,   // Import TimeScale for time-based data
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register required Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  TimeScale // Correctly register TimeScale for date formatting
);

interface EmotionChartProps {
  data: { emotion: string; intensity: number; timestamp: string }[];
}

const EmotionChart: React.FC<EmotionChartProps> = ({ data }) => {
  // Define the chart data
  const chartData = {
    labels: data.map((item) => new Date(item.timestamp)), // X-axis (timestamps)
    datasets: [
      {
        label: 'Emotion Intensity',
        data: data.map((item) => ({ x: new Date(item.timestamp), y: item.intensity })), // X (time) and Y (intensity)
        borderColor: '#4caf50', // Line color
        backgroundColor: 'rgba(76, 175, 80, 0.2)', // Fill color under the line
        pointRadius: 5, // Radius of data points
        pointBackgroundColor: '#388e3c',
        tension: 0.4, // Curve the line
        fill: true, // Fill the area under the line
      },
    ],
  };

  // Define the chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensure chart is responsive
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2); // Round to 2 decimal places
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time', // Correct scale type
        time: {
          unit: 'minute', // Granularity of X-axis labels
          tooltipFormat: 'MMM d, h:mm a', // Tooltip format
          displayFormats: {
            minute: 'h:mm a',
            hour: 'h:mm a',
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
          stepSize: 0.1,
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
