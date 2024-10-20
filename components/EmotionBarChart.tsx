import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

interface EmotionBarChartProps {
  data: { emotions: { emotion: string; intensity: number }[] };
}

export default function EmotionBarChart({ data }: EmotionBarChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (data && data.emotions) {
      // Safely access emotions and intensities
      const emotions = data.emotions.map(e => e.emotion);
      const intensities = data.emotions.map(e => e.intensity);

      setChartData({
        labels: emotions,
        datasets: [
          {
            label: 'Emotional Intensity',
            data: intensities,
            backgroundColor: ['#FFCC00', '#FF4500', '#0088FF', '#32CD32'],
          },
        ],
      });
    }
  }, [data]);

  // Fallback for no data or undefined data
  if (!data || !data.emotions || data.emotions.length === 0) {
    return <p>No emotional data available for the bar chart.</p>;
  }

  return chartData ? (
    <Bar data={chartData} />
  ) : (
    <p>Loading bar chart...</p>
  );
}
