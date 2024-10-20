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
      case "admiration":
        return "😍";
      case "adoration":
        return "🥰";
      case "aestheticAppreciation":
        return "🎨";
      case "amusement":
        return "😂";
      case "anger":
        return "😡";
      case "anxiety":
        return "😰";
      case "awe":
        return "😲";
      case "awkwardness":
        return "😅";
      case "boredom":
        return "😒";
      case "calmness":
        return "😌";
      case "concentration":
        return "🤔";
      case "confusion":
        return "😕";
      case "contemplation":
        return "🧐";
      case "contempt":
        return "😤";
      case "contentment":
        return "😊";
      case "craving":
        return "🤤";
      case "desire":
        return "💓";
      case "determination":
        return "💪";
      case "disappointment":
        return "😞";
      case "disgust":
        return "🤢";
      case "distress":
        return "😖";
      case "doubt":
        return "🤨";
      case "ecstasy":
        return "🤩";
      case "embarrassment":
        return "😳";
      case "empathicPain":
        return "😢";
      case "entrancement":
        return "👁️";
      case "envy":
        return "😒";
      case "excitement":
        return "😆";
      case "fear":
        return "😨";
      case "guilt":
        return "😔";
      case "horror":
        return "😱";
      case "interest":
        return "🤓";
      case "joy":
        return "😄";
      case "love":
        return "❤️";
      case "nostalgia":
        return "📸";
      case "pain":
        return "😣";
      case "pride":
        return "🏅";
      case "realization":
        return "💡";
      case "relief":
        return "😅";
      case "romance":
        return "💏";
      case "sadness":
        return "😢";
      case "satisfaction":
        return "😌";
      case "shame":
        return "😳";
      case "surpriseNegative":
        return "😦";
      case "surprisePositive":
        return "😮";
      case "sympathy":
        return "💔";
      case "tiredness":
        return "😴";
      case "triumph":
        return "🏆";
      default:
        return "😶"; // Default for unknown emotions
    }
  };

  // Utility function to convert camelCase to two words lowercase
  const camelCaseToWords = (emotion: string) => {
    return emotion
      .replace(/([A-Z])/g, ' $1') // Insert a space before each uppercase letter
      .toLowerCase(); // Convert the entire string to lowercase
  };


  return (
    <div className="flex flex-wrap justify-center space-x-4">
      {data.map((emotionData, index) => (
        <div key={index} className="p-4 m-2 border rounded shadow-md text-center">
          {/* Lookup the emoji by the emotion key */}
          <div className="text-4xl mb-2">{getEmotionEmoji(emotionData.emotion)}</div>
          {/* Convert camelCase emotion names to lowercase words */}
          <h3 className="text-xl font-semibold">{camelCaseToWords(emotionData.emotion)}</h3>
          <p className="text-lg">{Math.round(emotionData.intensity * 100)}%</p>
        </div>
      ))}
    </div>
  );
}
