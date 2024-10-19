"use client";

import PrintChats from "@/components/PrintChats";
import EmotionChart from "@/components/EmotionChart"; 
import EmotionCards from "@/components/EmotionCards";
import EmotionDonutChart from "@/components/EmotionDonutChart";
import EmotionBarChart from "@/components/EmotionBarChart"; 
import { useState, useEffect } from "react";

export default function ChatsPage() {
  const accessToken = process.env.NEXT_PUBLIC_HUME_API_KEY || '';
  const [emotionalData, setEmotionalData] = useState<any>(null);

  // Fetch mock JSON data
  useEffect(() => {
    const mockData = {
      userId: "12345",
      emotions: [
        { emotion: "happy", intensity: 0.8, timestamp: "2024-10-18T10:00:00Z" },
        { emotion: "sad", intensity: 0.5, timestamp: "2024-10-18T12:00:00Z" },
        { emotion: "angry", intensity: 0.6, timestamp: "2024-10-18T14:00:00Z" }
      ]
    };
    setEmotionalData(mockData);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Messages</h1>
      <PrintChats accessToken={accessToken} />

      <h2 className="text-xl font-bold mt-6 mb-4">Emotional History</h2>

      {emotionalData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Emotion Cards */}
          <div className="w-full">
            <EmotionCards data={emotionalData} />
          </div>

          {/* Emotion Donut Chart */}
          <div className="w-full h-64">
            <EmotionDonutChart data={emotionalData} />
          </div>

          {/* Emotion Intensity Bar Chart */}
          <div className="w-full h-64">
            <EmotionBarChart data={emotionalData} />
          </div>

          {/* Emotion Chart */}
          <div className="w-full h-64">
            <EmotionChart data={emotionalData} />
          </div>
        </div>
      )}
    </div>
  );
}
