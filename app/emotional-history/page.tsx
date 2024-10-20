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

// Fetch data using fetch API
const fetchEmotionData = async () => {
  try {
    const baseurl = '/chat_history/';
    const fileName = '2024-10-19T20:51:44.785Z.json';
    console.log("Fetching data from:", `${baseurl}${fileName}`);
    const response = await fetch(`${baseurl}${fileName}`);
    const data = await response.json();
    console.log("Fetched data:", data);
    return data;
  } catch (error) {
    console.error('Failed to fetch emotion data:', error);
    return null;
  }
};

interface EmotionScores {
  [key: string]: number;
}

const calculateEmotionAverages = (data: any[]) => {
  const emotionSums: EmotionScores = {};
  const emotionCounts: EmotionScores = {};
  let conversationStart: string | null = null;

  // Filtering user messages and aggregating emotion scores
  data.forEach(entry => {
    if (!conversationStart && entry.type === 'user_message' && entry.models && entry.models.prosody && entry.models.prosody.scores) {
      conversationStart = entry.receivedAt;
    }
    if (entry.type === 'user_message' && entry.models && entry.models.prosody && entry.models.prosody.scores) {
      const scores = entry.models.prosody.scores;
      Object.keys(scores).forEach(emotion => {
        if (!emotionSums.hasOwnProperty(emotion)) {
          emotionSums[emotion] = 0;
          emotionCounts[emotion] = 0;
        }
        emotionSums[emotion] += scores[emotion];
        emotionCounts[emotion]++;
      });
    }
  });

  // Calculating averages for each emotion
  const emotionAverages: EmotionScores = {};
  Object.keys(emotionSums).forEach(emotion => {
    emotionAverages[emotion] = emotionSums[emotion] / emotionCounts[emotion];
  });

  return {
    conversationStart, // Adds the conversation start timestamp
    ...emotionAverages
  };
};

// // Example of usage with your provided data
// const emotionData: any[] = [
//   // Insert your full data array here...
// ];

// const averages = calculateEmotionAverages(emotionData);
// console.log("Averages of user emotions:", averages);



export default function EmotionalHistory() {
  // const [emotionData, setEmotionData] = useState<any>(null);
  const [emotionAvgs, setEmotionAvgs] = useState<any>(null);
  const [viewOutliers, setViewOutliers] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // State to track if user is logged in
  const [recommendedMusic, setRecommendedMusic] = useState<any[]>([]); // State for recommended music

  useEffect(() => {
    fetchEmotionData().then(data => {
      if (data) {
        const calculatedAverages = calculateEmotionAverages(data);
        console.log("Setting emotion avgs:", JSON.stringify(calculatedAverages));
        setEmotionAvgs(calculatedAverages); // Ensure this line is inside the if check
      }
        
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
  // const calculateWeeklyAverage = (data: any) => {
  //   if (!emotionAvgs) {
  //     console.log("Emotion avgs is null");
  //     return 0;
  //   }
  //   console.log("Calculating weekly average for data:", data.weekEmotions);
  //   const totalIntensity = data.weekEmotions.reduce((acc: number, entry: any) => acc + entry.intensity, 0);
  //   const average = totalIntensity / data.weekEmotions.length;
  //   console.log("Calculated average intensity:", average);
  //   return average;
  // };

  // Filter for outliers based on intensity comparison with weekly average
  // const detectOutliers = (data: any, threshold = 0.7) => {
  //   const weeklyAvg = calculateWeeklyAverage(data);
  //   console.log("Detected weekly average:", weeklyAvg);
  //   const outliers = data.weekEmotions.filter((entry: any) => Math.abs(entry.intensity - weeklyAvg) > threshold);
  //   console.log("Outliers based on threshold:", outliers);
  //   return outliers;
  // };

  

  if (!emotionAvgs) {
    console.log("Emotion data is still loading or failed to load");
    return <p>Loading emotional data...</p>;
  }

  const conversationStart = emotionAvgs.conversationStart || new Date().toISOString();
  const emotionDataArray = Object.keys(emotionAvgs).map(emotion => ({
    emotion: emotion,
    intensity: emotionAvgs[emotion],
    timestamp: conversationStart
  }));
  console.log(JSON.stringify(emotionDataArray));

  // const weeklyAverage = calculateWeeklyAverage(emotionAvgs);
  const outliers = emotionAvgs;

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
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">Emotion Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <EmotionCards data={{ emotions: emotionDataArray }} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-4 shadow rounded-lg h-auto">
              <h2 className="text-xl font-semibold mb-4 text-center">Emotion Bar Chart</h2>
              <div className="h-80">
                <EmotionBarChart data={emotionDataArray} />
              </div>
            </div>
            <div className="bg-white p-4 shadow rounded-lg h-auto">
              <h2 className="text-xl font-semibold mb-4 text-center">Emotions Distribution</h2>
              <div className="h-80">
                <EmotionDonutChart data={emotionAvgs} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-6 text-center">Emotional Intensity Over Time</h2>
            <div className="h-96">
              <EmotionChart data={emotionAvgs} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
