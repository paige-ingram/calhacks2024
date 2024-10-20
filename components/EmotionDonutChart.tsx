import React from 'react';
import { Pie } from 'react-chartjs-2';

interface EmotionDonutChartProps {
  data: { emotions: { emotion: string; intensity: number }[] };
}

export default function EmotionDonutChart({ data }: EmotionDonutChartProps) {
  if (!data || !data.emotions) {
    // If data is undefined or empty, render a placeholder
    return <p>No emotional data available to display.</p>;
  }

  // Process the data to count emotion frequencies
  const emotionCounts: Record<string, number> = {};
  data.emotions.forEach(e => {
    emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + e.intensity;
  });

  // Prepare data for the chart
  const chartData = {
    labels: Object.keys(emotionCounts),
    datasets: [
      {
        data: Object.values(emotionCounts),
        backgroundColor: ['#FFCC00', '#FF4500', '#0088FF', '#32CD32'],
      },
    ],
  };

  return <Pie data={chartData} />;
}
