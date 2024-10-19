import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';

interface EmotionData {
  emotion: string;
  intensity: number;
  timestamp: string;
}

interface EmotionBarChartProps {
  data: { emotions: EmotionData[] };
}

export default function EmotionBarChart({ data }: EmotionBarChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (data) {
      const emotions = data.emotions.map(e => e.emotion);
      const intensities = data.emotions.map(e => e.intensity);

      setChartData({
        labels: emotions,
        datasets: [
          {
            label: 'Emotion Intensity',
            data: intensities,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [data]);

  return <div>{chartData && <Bar data={chartData} options={{ indexAxis: 'y' }} />}</div>;
}
