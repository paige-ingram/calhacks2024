import React, { useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'; // Import the core Chart.js class

interface EmotionData {
  emotion: string;
  intensity: number;
  timestamp: string;
}

interface EmotionDonutChartProps {
  data: EmotionData[];
}

export default function EmotionDonutChart({ data }: EmotionDonutChartProps) {
  const chartRef = useRef<ChartJS | null>(null); // Ref for Chart.js instance

  useEffect(() => {
    // Cleanup chart instance when component unmounts
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy the chart instance
      }
    };
  }, []);

  if (!data || data.length === 0) {
    return <p>No emotional data available to display.</p>;
  }

  // Process the data to count emotion frequencies
  const emotionCounts: Record<string, number> = {};
  data.forEach(e => {
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

  return (
    <div>
      <Pie data={chartData} ref={chartRef} /> 
    </div>
  );
}
