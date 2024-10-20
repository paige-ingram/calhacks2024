import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

interface EmotionChartProps {
  data: { emotions: { intensity: number; timestamp: string }[] };
}

export default function EmotionChart({ data }: EmotionChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (data && data.emotions) {
      // Safely access emotions
      const intensities = data.emotions.map((e) => e.intensity);
      const timestamps = data.emotions.map((e) =>
        new Date(e.timestamp).toLocaleTimeString()
      );

      setChartData({
        labels: timestamps,
        datasets: [
          {
            label: 'Emotional Intensity Over Time',
            data: intensities,
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1,
          },
        ],
      });
    }
  }, [data]);

  if (!data || !data.emotions || data.emotions.length === 0) {
    return <p>No data available for the chart.</p>;
  }

  return chartData ? (
    <Line data={chartData} />
  ) : (
    <p>Loading chart...</p>
  );
}
