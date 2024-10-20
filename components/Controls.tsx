"use client";
import { Button } from "./ui/button";
import { useVoice } from "@humeai/voice-react";
import { Mic, MicOff, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Toggle } from "./ui/toggle";
import MicFFT from "./MicFFT";
import { cn } from "@/utils";
import axios from "axios";

export default function Controls({ chatHistory }: { chatHistory: any[] }) {
  const { disconnect, status, isMuted, unmute, mute, micFft } = useVoice();

  // Function to save the chat history when the call ends
  const saveChatHistory = async () => {
    const timestamp = new Date().toISOString(); // Unique identifier for the chat

    try {
      const response = await axios.post("/api/saveChatHistory", {
        chatHistory,
        timestamp,
      });
      console.log("Chat history saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };

  return (
    <div className={cn("fixed bottom-0 left-0 w-full p-4 flex items-center justify-center", "bg-gradient-to-t from-card via-card/90 to-card/0")}>
      <AnimatePresence>
        {status.value === "connected" ? (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            className="p-4 bg-card border border-border rounded-lg shadow-sm flex items-center gap-4"
          >
            <Toggle pressed={!isMuted} onPressedChange={() => (isMuted ? unmute() : mute())}>
              {isMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
            </Toggle>

            <div className="relative grid h-8 w-48 shrink grow-0">
              <MicFFT fft={micFft} className="fill-current" />
            </div>

            <Button
              className="flex items-center gap-1"
              onClick={() => {
                disconnect(); // End the call
                saveChatHistory(); // Save chat history after the call ends
              }}
              variant="destructive"
            >
              <span>
                <Phone className="size-4 opacity-50" strokeWidth={2} stroke="currentColor" />
              </span>
              <span>End Call</span>
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
