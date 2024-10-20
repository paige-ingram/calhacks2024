"use client"; // Ensure this is a client-side component

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

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

  // Fetch access token immediately when the component mounts
  useEffect(() => {
    const getAccessToken = async () => {
      const token = await fetchAccessToken();
      setAccessToken(token);
    };
    
    getAccessToken(); // Fetch the token on component mount
  }, []);

  return (
    <div className="grow flex flex-col">
      {/* Render Chat once accessToken is available */}
      {accessToken ? (
        <Chat accessToken={accessToken} />
      ) : (
        <p></p>
      )}
    </div>
  );
}
