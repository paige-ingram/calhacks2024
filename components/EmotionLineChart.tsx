// EmotionLineChart.tsx

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
import { useState } from 'react';

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
  allEmotions: string[];
}

const EmotionLineChart: React.FC<EmotionLineChartProps> = ({ data, allEmotions }) => {
  // Helper function to get the emotion with the highest recent intensity
  const getDefaultEmotion = () => {
    if (data.length === 0) return allEmotions[0] || "defaultEmotion"; // Fallback if data is empty
    return data.reduce((highest, entry) =>
      entry.intensity > highest.intensity ? entry : highest
    ).emotion;
  };

  // State to hold selected emotion for dropdown
  const [selectedEmotion, setSelectedEmotion] = useState(getDefaultEmotion());

  // Filter the data for the selected emotion
  const filteredData = data.filter(entry => entry.emotion === selectedEmotion);

  // Prepare chart data
  const chartData = {
    labels: filteredData.map(entry => new Date(entry.timestamp).toLocaleDateString()), // X-axis labels
    datasets: [
      {
        label: `${selectedEmotion} Intensity`,
        data: filteredData.map(entry => entry.intensity), // Y-axis values
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
        text: `Emotional Intensity Over Time - ${selectedEmotion}`,
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
        max: 1,
      },
    },
  };

  return (
    <div className="w-full">
      <div className="flex justify-center mb-4">
        <select
          value={selectedEmotion}
          onChange={(e) => setSelectedEmotion(e.target.value)}
          className="p-2 border rounded"
        >
          {allEmotions.map(emotion => (
            <option key={emotion} value={emotion}>{emotion}</option>
          ))}
        </select>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default EmotionLineChart;
