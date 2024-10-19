import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';

// Register the category scale
Chart.register(CategoryScale);

interface EmotionData {
  emotion: string;
  intensity: number;
  timestamp: string;
}

interface EmotionChartProps {
  data: { emotions: EmotionData[] };
}

export default function EmotionChart({ data }: EmotionChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (data) {
      const intensities = data.emotions.map((e) => e.intensity);
      const timestamps = data.emotions.map((e) =>
        new Date(e.timestamp).toLocaleTimeString()
      );

      setChartData({
        labels: timestamps,
        datasets: [
          {
            label: "Emotional Intensity",
            data: intensities,
            fill: false,
            borderColor: "rgba(75,192,192,1)",
            tension: 0.1,
          },
        ],
      });
    }
  }, [data]);

  return (
    <div>
      {chartData && <Line data={chartData} />}
    </div>
  );
}
