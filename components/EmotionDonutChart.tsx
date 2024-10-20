import React, { useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ChartData, ChartOptions } from 'chart.js';

interface EmotionData {
  emotion: string;
  intensity: number;
  timestamp: string;
}

interface EmotionDonutChartProps {
  data: EmotionData[];
}

export default function EmotionDonutChart({ data }: EmotionDonutChartProps) {
  const chartRef = useRef<ChartJS<'pie'> | null>(null); // Use correct typing for Chart.js instance

  useEffect(() => {
    // Cleanup chart instance when component unmounts or updates
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy the Chart.js instance
        chartRef.current = null;
      }
    };
  }, [data]);

  if (!data || data.length === 0) {
    return <p>No emotional data available to display.</p>;
  }

  // Process the data to count emotion frequencies
  const emotionCounts: Record<string, number> = {};
  data.forEach((e) => {
    emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + e.intensity;
  });

  // Prepare data for the chart
  const chartData: ChartData<'pie'> = {
    labels: Object.keys(emotionCounts),
    datasets: [
      {
        data: Object.values(emotionCounts),
        backgroundColor: ['#FFCC00', '#FF4500', '#0088FF', '#32CD32'],
      },
    ],
  };

  return (
    <div>
      <Pie
        data={chartData}
        ref={(instance) => {
          chartRef.current = instance ?? null; // Store the Chart.js instance safely
        }}
      />
    </div>
  );
}
