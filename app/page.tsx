"use client"; // Ensure this is a client-side component

import { useState } from "react";
import dynamic from "next/dynamic";
import FaceRecognition from "@/components/FaceRecognition";

// Dynamically load Chat component for client-side only
const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false, // Only load on the client-side
});

// Fetch Hume Access Token
async function fetchAccessToken() {
  const baseUrl =
    typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      : '';

  const response = await fetch(`${baseUrl}/api/getHumeAccessToken`);
  const data = await response.json();
  return data.accessToken;
}

export default function Page() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [personName, setPersonName] = useState<string | null>(null); // Store the detected person's name

  // Handle person detection and face recognition
  const handlePersonRecognized = async (name: string) => {
    const token = await fetchAccessToken();
    setAccessToken(token);
    setPersonName(name); // Set the detected person's name
  };

  return (
    <div className="grow flex flex-col">
      {/* Show the FaceRecognition component if no person has been recognized yet */}
      {!personName && (
        <FaceRecognition onPersonDetected={handlePersonRecognized} />
      )}

      {/* Once person is recognized and accessToken is available, show Chat and Start Call button */}
      {personName && accessToken && (
        <>
          <p>Welcome, {personName}!</p>
          <Chat accessToken={accessToken} />
          <button
            onClick={() => console.log("Starting call...")}
            className="btn-start-call"
          >
            Start Call (For Dev Purpose)
          </button>
        </>
      )}
    </div>
  );
}
