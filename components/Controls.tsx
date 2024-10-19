"use client";
import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Mic, MicOff, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Toggle } from "./ui/toggle";
import MicFFT from "./MicFFT";
import { cn } from "@/utils";
import { HumeClient } from "hume";

export default function Controls() {
  const { disconnect, status, isMuted, unmute, mute, micFft } = useVoice();

  // Function to fetch chat history after the call ends
  const fetchChatHistory = async () => {
    const apiKey = process.env.NEXT_PUBLIC_HUME_API_KEY; // Use the API key from the environment variables

    if (!apiKey) {
      console.error("Hume API key is missing.");
      return;
    }

    const client = new HumeClient({ apiKey });

    try {
      // Fetch the chat history using the Hume API
      const chats = await client.empathicVoice.chats.listChats({
        pageNumber: 0,
        pageSize: 10, // Adjust pagination if necessary
        ascendingOrder: true,
      });

      console.log('Chat History:', chats);  // Print chat history in the terminal

      // Optionally, save the chat history to a JSON file (for Node.js environments)
      // const fs = require('fs');
      // fs.writeFileSync('chat_history.json', JSON.stringify(chats, null, 2));

    } catch (error) {
      console.error("Error fetching chat history:", error);  // Error handling
    }
  };

  return (
    <div
      className={
        cn(
          "fixed bottom-0 left-0 w-full p-4 flex items-center justify-center",
          "bg-gradient-to-t from-card via-card/90 to-card/0",
        )
      }
    >
      <AnimatePresence>
        {status.value === "connected" ? (
          <motion.div
            initial={{
              y: "100%",
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: "100%",
              opacity: 0,
            }}
            className={
              "p-4 bg-card border border-border rounded-lg shadow-sm flex items-center gap-4"
            }
          >
            <Toggle
              pressed={!isMuted}
              onPressedChange={() => {
                if (isMuted) {
                  unmute();
                } else {
                  mute();
                }
              }}
            >
              {isMuted ? (
                <MicOff className={"size-4"} />
              ) : (
                <Mic className={"size-4"} />
              )}
            </Toggle>

            <div className={"relative grid h-8 w-48 shrink grow-0"}>
              <MicFFT fft={micFft} className={"fill-current"} />
            </div>

            <Button
              className={"flex items-center gap-1"}
              onClick={() => {
                disconnect();  // End the call
                fetchChatHistory();  // Fetch chat history after call ends
              }}
              variant={"destructive"}
            >
              <span>
                <Phone
                  className={"size-4 opacity-50"}
                  strokeWidth={2}
                  stroke={"currentColor"}
                />
              </span>
              <span>End Call</span>
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
