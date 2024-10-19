import dynamic from "next/dynamic";
import Camera from "@/components/Camera";

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
});

async function fetchAccessToken() {
  const baseUrl = 
    typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' // Set your server's base URL here
      : '';

  const response = await fetch(`${baseUrl}/api/getHumeAccessToken`);
  const data = await response.json();
  return data.accessToken;
}

export default async function Page() {
  const accessToken = await fetchAccessToken();

  if (!accessToken) {
    throw new Error("Failed to get access token");
  }

  return (
    <div className="grow flex flex-col">
      <Camera />
      <Chat accessToken={accessToken} />
    </div>
  );
}
