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
    const response = await fetch('/api/getEmotionData'); // Calls the new API route
    const data = await response.json(); // Parse the JSON response
    console.log("Fetched data from MongoDB:", data);
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
  console.log("This is what the data looks like: " + JSON.stringify(data));
  const emotionSums: EmotionScores = {};
  const emotionCounts: EmotionScores = {};
  let conversationStart: string | null = null;

  data.forEach(entry => {
    if (entry.chatHistory) {
      entry.chatHistory.forEach((item: any) => {
        if (item.type === 'user_message' && item.models && item.models.prosody && item.models.prosody.scores) {
          if (!conversationStart) conversationStart = item.receivedAt;
          const scores = item.models.prosody.scores;
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
    }
  });

  const emotionAverages: EmotionScores = {};
  Object.keys(emotionSums).forEach(emotion => {
    if (emotionCounts[emotion] > 0) {
      emotionAverages[emotion] = emotionSums[emotion] / emotionCounts[emotion];
    }
  });

  return {
    conversationStart,
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
    fetchEmotionData().then(async data => {
      if (data) {
        const calculatedAverages = calculateEmotionAverages(data);
        console.log("Setting emotion avgs:", JSON.stringify(calculatedAverages));
        setEmotionAvgs(calculatedAverages); 
      }
        
      // Fetch recommended music if logged in
      if (loggedIn && data.length > 0) {
        const firstEmotion = "happiness";
        const music = await fetchRecommendedMusic(firstEmotion);
        setRecommendedMusic(music);
      }
    });
    // getData();
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
  console.log("These are the emotion avgs: " + emotionAvgs);
  
  const emotionDataArray = Object.keys(emotionAvgs)
  .filter(emotion => emotion !== 'conversationStart') // Exclude 'conversationStart'
  .map((emotion, index) => ({
    emotion: emotion,
    intensity: emotionAvgs[emotion],
    timestamp: new Date(new Date(emotionAvgs.conversationStart).getTime() + index * 60000).toISOString(), // Increment time by 1 minute for each entry
  }));
  console.log("here is emotion data array: " + JSON.stringify(emotionDataArray));
  

  // const weeklyAverage = calculateWeeklyAverage(emotionAvgs);
  const outliers = emotionAvgs;

  // need to fix this stuff
  const filteredEmos = emotionDataArray;

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
              <EmotionCards data={emotionDataArray} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-4 shadow rounded-lg h-auto">
              <h2 className="text-xl font-semibold mb-4 text-center">Emotion Bar Chart</h2>
              <div className="h-80">
                <EmotionBarChart data={emotionDataArray} />
              </div>
            </div>
            {/* <div className="bg-white p-4 shadow rounded-lg h-auto">
              <h2 className="text-xl font-semibold mb-4 text-center">Emotions Distribution</h2>
              <div className="h-80">
                <EmotionDonutChart data={emotionDataArray} />
              </div>
            </div> */}
          </div>
          {/* <div className="bg-white p-6 shadow rounded-lg">
            
            <h2 className="text-xl font-semibold mb-6 text-center">Emotional Intensity Over Time</h2>
            <div className="h-96">
              <EmotionChart data={emotionDataArray} />
            </div>
          </div> */}
        </>
      )}
    </div>
  );
}
