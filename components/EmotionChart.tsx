import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, ChartData } from 'chart.js';

interface EmotionData {
  emotion: string;
  intensity: number;
  timestamp: string;
}

interface EmotionChartProps {
  data: EmotionData[]; // Accepts an array of EmotionData
}

export default function EmotionChart({ data }: EmotionChartProps) {
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const chartRef = useRef<ChartJS<'line'> | null>(null); // Use correct typing for Chart.js instance

  useEffect(() => {
    if (data && data.length > 0) {
      // Extract intensities and timestamps from the data array
      const intensities = data.map((e) => e.intensity);
      const timestamps = data.map((e) =>
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

    // Cleanup chart instance when component unmounts or updates
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy the Chart.js instance
        chartRef.current = null;
      }
    };
  }, [data]);

  if (!data || data.length === 0) {
    return <p>No data available for the chart.</p>;
  }

  return chartData ? (
    <Line
      data={chartData}
      ref={(instance) => {
        chartRef.current = instance ?? null; // Store the Chart.js instance safely
      }}
    />
  ) : (
    <p>Loading chart...</p>
  );
}
