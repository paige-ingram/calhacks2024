"use client";

import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef, useEffect, useState } from "react";

export default function PrintChats({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const [chatData, setChatData] = useState<any>(null);

  const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const url = new URL('https://api.hume.ai/v0/evi/chats');

        const params: { [key: string]: string } = {
          page_number: '0',
          page_size: '1',
          ascending_order: 'true'
        };

        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'X-Hume-Api-Key': accessToken 
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
      }
    };

    fetchChats(); 
  }, [accessToken]);

  return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"
      }
    >
      {}
    </div>
  );
}
