import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import PrintChats from "@/components/PrintChats";
import { ApiError } from "next/dist/server/api-utils";

export default async function ChatsPage() {
  const accessToken = await getHumeAccessToken();
  const apiKey = process.env.HUME_API_KEY as string; 
  console.log(apiKey);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Messages</h1>
      <PrintChats apiKey={apiKey} />
    </div>
  );
}
