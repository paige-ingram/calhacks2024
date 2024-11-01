"use client";

import { useState, useEffect } from "react";
import EmotionLineChart from '@/components/EmotionLineChart';
import SpotifyLoginButton from '@/components/ui/SpotifyLoginButton';
import EmotionCards from '@/components/EmotionCards';


const emotionEmojis: { [key: string]: string } = {
  admiration: "👏",
  adoration: "😍",
  aestheticAppreciation: "🎨",
  amusement: "😂",
  anger: "😡",
  anxiety: "😰",
  awe: "😲",
  awkwardness: "😅",
  boredom: "😐",
  calmness: "😌",
  concentration: "🧐",
  confusion: "😕",
  contemplation: "🤔",
  contempt: "😒",
  contentment: "😊",
  craving: "🍩",
  desire: "💘",
  determination: "💪",
  disappointment: "😞",
  disgust: "🤢",
  distress: "😖",
  doubt: "🤨",
  ecstasy: "🤩",
  embarrassment: "😳",
  empathicPain: "😢",
  entrancement: "💫",
  envy: "😒",
  excitement: "🤗",
  fear: "😱",
  guilt: "😬",
  horror: "😨",
  interest: "👀",
  joy: "😁",
  love: "❤️",
  nostalgia: "🌅",
  pain: "💔",
  pride: "🏆",
  realization: "💡",
  relief: "😮‍💨",
  romance: "💏",
  sadness: "😢",
  satisfaction: "😌",
  shame: "😳",
  surpriseNegative: "😦",
  surprisePositive: "😲",
  sympathy: "💞",
  tiredness: "😴",
  triumph: "🎉"
};


const emotionColors = {
  admiration: "#FFAA00",
  adoration: "#FF69B4",
  aestheticAppreciation: "#8B4513",
  amusement: "#FFD700",
  anger: "#FF0000",
  anxiety: "#A52A2A",
  awe: "#6A5ACD",
  awkwardness: "#D2691E",
  boredom: "#808080",
  calmness: "#00CED1",
  concentration: "#4682B4",
  confusion: "#A9A9A9",
  contemplation: "#708090",
  contempt: "#8B0000",
  contentment: "#7FFF00",
  craving: "#FF6347",
  desire: "#DC143C",
  determination: "#1E90FF",
  disappointment: "#696969",
  disgust: "#556B2F",
  distress: "#8B0000",
  doubt: "#D3D3D3",
  ecstasy: "#FF4500",
  embarrassment: "#FFB6C1",
  empathicPain: "#A52A2A",
  entrancement: "#6A5ACD",
  envy: "#228B22",
  excitement: "#FF8C00",
  fear: "#2F4F4F",
  guilt: "#808080",
  horror: "#000000",
  interest: "#1E90FF",
  joy: "#FFD700",
  love: "#FF1493",
  nostalgia: "#B0C4DE",
  pain: "#A52A2A",
  pride: "#FF6347",
  realization: "#4682B4",
  relief: "#98FB98",
  romance: "#FF69B4",
  sadness: "#4169E1",
  satisfaction: "#32CD32",
  shame: "#A9A9A9",
  surpriseNegative: "#DAA520",
  surprisePositive: "#FFD700",
  sympathy: "#8B4513",
  tiredness: "#708090",
  triumph: "#FF4500"
};

// Fetch data using fetch API
const fetchEmotionData = async () => {
  try {
    const response = await fetch('/api/getEmotionData'); // Calls the new API route
    const data = await response.json(); // Parse the JSON response
    console.log("Fetched data from MongoDB:", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Failed to fetch emotion data:', error);
    return [];
  }
};

interface EmotionScores {
  [emotion: string]: number;
}

interface ProsodyModel {
  scores: EmotionScores;
}

interface ChatMessage {
  type: string;
  message: {
    role: string;
    content: string;
  };
  models?: {
    prosody?: ProsodyModel;
  };
}

interface ChatEntry {
  _id: string;
  timestamp: string;
  chatHistory: ChatMessage[];
}

interface EmotionData {
  emotion: string;
  intensity: number;
  timestamp: string;
}


const processEmotionData = (data: ChatEntry[]): EmotionData[] => {
  const emotionDataArray: EmotionData[] = [];

  data.forEach((entry) => {
    const timestamp = entry.timestamp;
    const emotionSums: { [emotion: string]: number } = {};
    const emotionCounts: { [emotion: string]: number } = {};

    entry.chatHistory.forEach((chat) => {
      if (
        chat &&
        chat.message &&
        chat.message.role === 'user' &&
        chat.models &&
        chat.models.prosody &&
        chat.models.prosody.scores
      ) {
        const emotions = chat.models.prosody.scores;

        for (const [emotion, score] of Object.entries(emotions)) {
          if (!emotionSums[emotion]) {
            emotionSums[emotion] = 0;
            emotionCounts[emotion] = 0;
          }
          emotionSums[emotion] += score;
          emotionCounts[emotion] += 1;
        }
      }
    });

    for (const [emotion, totalScore] of Object.entries(emotionSums)) {
      const averageIntensity = totalScore / emotionCounts[emotion];
      emotionDataArray.push({
        emotion,
        intensity: parseFloat(averageIntensity.toFixed(2)),
        timestamp
      });
    }
  });

  return emotionDataArray;
};





export default function EmotionalHistory() {
  const [viewMode, setViewMode] = useState("weekly");
  const [emotionDataArray, setEmotionDataArray] = useState<any[]>([]); 
  const loggedIn = false;
  const recommendedMusic: { name: string; artists: { name: string }[] }[] = [];

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchEmotionData(); // Fetch the data
      setEmotionDataArray(processEmotionData(data)); // Process and set it in state
    };
    fetchData();
  }, []);



  return (
    <div className="w-full p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Your Emotional History</h1>

      {/* Spotify Login Button */}
      <div className="mb-4">
      {loggedIn && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Music Recommendations Based on Your Mood</h2>
          <ul>
            {recommendedMusic.map((track, index) => (
              <li key={index}>
                <p>{track.name} by {track.artists[0]?.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          className={`px-4 py-2 rounded ${viewMode === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setViewMode('weekly')}
        >
          Weekly View
        </button>
        <button
          className={`px-4 py-2 rounded ${viewMode === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setViewMode('monthly')}
        >
          Monthly View
        </button>
      </div>

      {/* Emotion Overview Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">Emotion Overview ({viewMode.charAt(0).toUpperCase() + viewMode.slice(1)})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Emotion Overview Cards */}
        <div className="w-full mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Emotion Overview ({viewMode.charAt(0).toUpperCase() + viewMode.slice(1)})</h2>
          <EmotionCards data={emotionDataArray} emotionEmojis={emotionEmojis} emotionColors={emotionColors} />
        </div>
        </div>
      </div>

      {/* Line Chart for Emotion Trends */}
      <div className="bg-white p-6 shadow rounded-lg w-full">
        <h2 className="text-xl font-semibold mb-6 text-center">Emotional Intensity Over Time (Line Chart)</h2>
        <div className="h-96">
          <EmotionLineChart data={emotionDataArray} />
        </div>
      </div>
    </div>
  );
}
