"use client";

import { useEffect, useState } from "react";

interface EmotionCardsProps {
  data: EmotionData[];
  emotionEmojis: { [key: string]: string };
  emotionColors: { [key: string]: string };
}

interface EmotionData {
  emotion: string;
  intensity: number;
  timestamp: string;
}

  // Utility function to convert camelCase to two words lowercase
  const camelCaseToWords = (emotion: string) => {
    return emotion
      .replace(/([A-Z])/g, ' $1') // Insert a space before each uppercase letter
      .toLowerCase(); // Convert the entire string to lowercase
  };

  export default function EmotionCards({ data, emotionEmojis, emotionColors }: EmotionCardsProps) {
    const getEmotionEmoji = (emotion: string) => emotionEmojis[emotion] || "😶";
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full"> {/* Enforce a responsive grid with 3 columns */}
        {data.map((emotionData, index) => (
          <div
            key={index}
            className="p-4 border rounded shadow-md text-center w-full"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="text-4xl mb-2">{getEmotionEmoji(emotionData.emotion)}</div>
            <h3 className="text-xl font-semibold">{camelCaseToWords(emotionData.emotion)}</h3>
            <p className="text-lg">{Math.round(emotionData.intensity * 100)}%</p>
          </div>
        ))}
      </div>
    );
  }
  