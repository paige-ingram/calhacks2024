"use client"; // Ensure this is a client-side component

import { useState } from "react";
import dynamic from "next/dynamic";
import Camera from "@/components/Camera";

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false, // Only load on the client-side
});

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
  const [personDetected, setPersonDetected] = useState(false);

  // Fetch access token only after person detection
  const handlePersonDetected = async () => {
    const token = await fetchAccessToken();
    setAccessToken(token);
    setPersonDetected(true); // Update state when person is detected
  };

  return (
    <div className="grow flex flex-col">
      {!personDetected && (
        <Camera onPersonDetected={handlePersonDetected} />
      )}

      {/* Once person is detected and accessToken is available, show Chat and Start Call button */}
      {personDetected && accessToken && (
        <>
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
