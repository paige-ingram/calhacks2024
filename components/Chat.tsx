"use client";
import { VoiceProvider, useVoice } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef, useState } from "react";
import Link from "next/link";  // Import Link from next/link
import { Button } from './ui/button'; 

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

  // Chat history state
  const [chatHistory, setChatHistory] = useState<Array<any>>([]);

  // optional: use configId from environment variable
  const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];
  
  // Function to handle new messages
  const handleNewMessage = (message: any) => {
    // Update the chat history when new messages arrive
    setChatHistory((prev) => [...prev, message]);

    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }

    timeout.current = window.setTimeout(() => {
      if (ref.current) {
        const scrollHeight = ref.current.scrollHeight;

        ref.current.scrollTo({
          top: scrollHeight,
          behavior: "smooth",
        });
      }
    }, 200);
  };

  return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"
      }
    >
      <VoiceProvider
        auth={{ type: "accessToken", value: accessToken }}
        configId={configId}
        onMessage={handleNewMessage}
      >
        <Messages ref={ref} />
        <Controls chatHistory={chatHistory} />
        <StartCall />

        {/* Button to navigate to the emotional history */}
        <div className="mt-4">
          <Link href="/emotional-history">
            <Button
              className="glow-button z-50 flex items-center gap-2 px-6 py-3 relative"
            >
              <span className="font-semibold">View Emotional History</span>
            </Button>
          </Link>
        </div>
      </VoiceProvider>
    </div>
  );
}
