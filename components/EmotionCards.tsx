"use client";

import { useEffect, useState } from "react";

interface EmotionData {
  emotion: string;
  intensity: number;
  timestamp: string;
}

// Modify EmotionCardsProps to accept an array directly
interface EmotionCardsProps {
  data: EmotionData[];
}

export default function EmotionCards({ data }: EmotionCardsProps) {
  const getEmotionEmoji = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return "😄";
      case "sad":
        return "😢";
      case "angry":
        return "😠";
      default:
        return "😶";
    }
  };

  return (
    <div className="flex flex-wrap justify-center space-x-4">
      {/* Use the data array directly */}
      {data.map((emotionData, index) => (
        <div key={index} className="p-4 m-2 border rounded shadow-md text-center">
          <div className="text-4xl mb-2">{getEmotionEmoji(emotionData.emotion)}</div>
          <h3 className="text-xl font-semibold">{emotionData.emotion}</h3>
          <p className="text-lg">{Math.round(emotionData.intensity * 100)}%</p>
        </div>
      ))}
    </div>
  );
}
