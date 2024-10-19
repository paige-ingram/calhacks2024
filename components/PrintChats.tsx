"use client";

import Messages from "./Messages";
import { ComponentRef, useRef, useEffect, useState } from "react";

export default function PrintChats({
  apiKey,
}: {
  apiKey: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const [chatData, setChatData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const url = new URL('https://api.hume.ai/v0/evi/chats');
    const fetchChats = async () => {
      try {
        const url = new URL('https://api.hume.ai/v0/evi/chats');

        const params: { [key: string]: string } = {
          page_number: '0',
          page_size: '1',
          ascending_order: 'true'
        };

        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        console.log(apiKey)

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'X-Hume-Api-Key': apiKey
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched chat data:", data); 
        setChatData(data); 
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchChats(); 
  }, [apiKey]);

  if (isLoading) {
    return <div>Loading chat data...</div>; 
  }

  if (!chatData || chatData.length === 0) {
    return <div>No chat data available</div>; 
  }

  return (
    <div className="chat-container">
      <h2 className="text-xl font-bold">Chat Messages</h2>
      <div className="chat-messages">
        <p>Here is the chat data: {chatData[10]}</p>
      </div>
    </div>
  );
}