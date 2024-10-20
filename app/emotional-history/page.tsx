"use client";

import { useState, useEffect } from "react";
import EmotionBarChart from '@/components/EmotionBarChart';
import EmotionCards from '@/components/EmotionCards';
import EmotionChart from '@/components/EmotionChart';
import EmotionDonutChart from '@/components/EmotionDonutChart';
import SpotifyLoginButton from '@/components/ui/SpotifyLoginButton';
import { fetchRecommendedMusic } from '@/lib/spotify';

// Color mapping for emotions
const emotionColors: Record<string, string> = {
  happy: "yellow",
  sad: "bronze",
  angry: "red",
};

// Mock function to simulate fetching JSON data (replace this with actual data-fetching logic)
const fetchEmotionData = async () => {
  return {
    weekEmotions: [
      { emotion: 'happy', intensity: 0.9, date: '2024-10-13' },
      { emotion: 'sad', intensity: 0.3, date: '2024-10-14' },
      { emotion: 'angry', intensity: 0.4, date: '2024-10-15' },
      { emotion: 'happy', intensity: 0.8, date: '2024-10-16' },
      { emotion: 'sad', intensity: 0.5, date: '2024-10-17' },
      { emotion: 'happy', intensity: 0.7, date: '2024-10-18' },
      { emotion: 'angry', intensity: 0.6, date: '2024-10-19' },
    ]
  };
};

export default function EmotionalHistory() {
  const [emotionData, setEmotionData] = useState<any>(null);
  const [viewOutliers, setViewOutliers] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // State to track if user is logged in
  const [recommendedMusic, setRecommendedMusic] = useState<any[]>([]); // State for recommended music

  useEffect(() => {
    const getData = async () => {
      const data = await fetchEmotionData();
      setEmotionData(data);

      // Fetch recommended music if logged in
      if (loggedIn && data.weekEmotions.length > 0) {
        const firstEmotion = data.weekEmotions[0].emotion;
        const music = await fetchRecommendedMusic(firstEmotion);
        setRecommendedMusic(music);
      }
    };
    getData();
  }, [loggedIn]); // Refetch recommended music once logged in

  // Function to calculate the weekly average intensity
  const calculateWeeklyAverage = (data: any) => {
    const totalIntensity = data.weekEmotions.reduce((acc: number, entry: any) => acc + entry.intensity, 0);
    return totalIntensity / data.weekEmotions.length;
  };

  // Filter for outliers based on intensity comparison with weekly average
  const detectOutliers = (data: any, threshold = 0.7) => {
    const weeklyAvg = calculateWeeklyAverage(data);
    return data.weekEmotions.filter((entry: any) => Math.abs(entry.intensity - weeklyAvg) > threshold);
  };

  if (!emotionData) {
    return <p>Loading emotional data...</p>;
  }

  const weeklyAverage = calculateWeeklyAverage(emotionData);
  const outliers = detectOutliers(emotionData);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Your Weekly Emotional History</h1>

      {/* Spotify Login Button */}
      {!loggedIn ? (
        <SpotifyLoginButton />
      ) : (
        <>
          {/* Recommended Music */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">Music Recommendations Based on Your Mood</h2>
            <ul>
              {recommendedMusic.map((track, index) => (
                <li key={index}>
                  <p>{track.name} by {track.artists[0].name}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Toggle View for Outliers */}
      <button
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setViewOutliers(!viewOutliers)}
      >
        {viewOutliers ? "Show All Data" : "Show Outliers"}
      </button>

      {viewOutliers ? (
        <div>
          <h3 className="text-lg font-bold">Outliers (Significant Emotional Deviations)</h3>
          {outliers.map((entry: any, index: number) => (
            <div key={index} className="p-2">
              <p>{entry.date}: Intensity {entry.intensity.toFixed(2)}</p>
              <span style={{ color: emotionColors[entry.emotion] }}>{entry.emotion}</span>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Emotion Overview Cards */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">Emotion Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <EmotionCards data={{ emotions: emotionData.weekEmotions }} />
            </div>
          </div>

          {/* Bar Chart and Donut Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-4 shadow rounded-lg h-auto">
              <h2 className="text-xl font-semibold mb-4 text-center">Emotion Bar Chart</h2>
              <div className="h-80">
                <EmotionBarChart data={emotionData.weekEmotions} />
              </div>
            </div>
            <div className="bg-white p-4 shadow rounded-lg h-auto">
              <h2 className="text-xl font-semibold mb-4 text-center">Emotions Distribution</h2>
              <div className="h-80">
                <EmotionDonutChart data={emotionData.weekEmotions} />
              </div>
            </div>
          </div>

          {/* Line Chart (Emotion Over Time) */}
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-6 text-center">Emotional Intensity Over Time</h2>
            <div className="h-96">
              <EmotionChart data={emotionData.weekEmotions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
