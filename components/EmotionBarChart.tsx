import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface EmotionBarChartProps {
  data: { emotion: string; intensity: number; timestamp: string }[];
}

export default function EmotionBarChart({ data }: EmotionBarChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      // Filter out non-numeric intensities (like "conversationStart") and map emotions and intensities
      const filteredEmotions = data.filter(e => typeof e.intensity === 'number');
      const emotions = filteredEmotions.map(e => e.emotion);
      const intensities = filteredEmotions.map(e => e.intensity);

      setChartData({
        labels: emotions,
        datasets: [
          {
            label: 'Emotional Intensity',
            data: intensities,
            backgroundColor: ['#0084FF', '#8400FF'], // Customize colors as needed
          },
        ],
      });
    }
  }, [data]);

  // Fallback for no data or undefined data
  if (!data || data.length === 0) {
    return <p>No emotional data available for the bar chart.</p>;
  }

  return chartData ? (
    <Bar data={chartData} />
  ) : (
    <p>Loading bar chart...</p>
  );
}
