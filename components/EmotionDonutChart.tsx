import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import Chart from 'chart.js/auto';

interface EmotionData {
  emotion: string;
  intensity: number;
  timestamp: string;
}

interface EmotionDonutChartProps {
  data: { emotions: EmotionData[] };
}

export default function EmotionDonutChart({ data }: EmotionDonutChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (data) {
      const emotionCounts: Record<string, number> = {};
      data.emotions.forEach(e => {
        emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + e.intensity;
      });

      setChartData({
        labels: Object.keys(emotionCounts),
        datasets: [
          {
            label: 'Emotions Distribution',
            data: Object.values(emotionCounts),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      });
    }
  }, [data]);

  return <div>{chartData && <Doughnut data={chartData} />}</div>;
}
