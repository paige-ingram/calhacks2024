import { VoiceProvider, useVoice } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef, useState } from "react";

export default function ClientComponent({ accessToken }: { accessToken: string }) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const hiddenButtonRef = useRef<HTMLButtonElement | null>(null);  // Reference to the hidden button

  // Chat history state
  const [chatHistory, setChatHistory] = useState<Array<any>>([]);

  // optional: use configId from environment variable
  const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];

  return (
    <div className="relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]">
      <VoiceProvider
        auth={{ type: "accessToken", value: accessToken }}
        configId={configId}
        onMessage={(message: any) => {
          setChatHistory((prev) => [...prev, message]);

          if (timeout.current) {
            window.clearTimeout(timeout.current);
          }

          console.log("Connected to WebSocket!");

          // Trigger the click event on the hidden button when socket opens
          if (message.type === "chat_metadata" && hiddenButtonRef.current) {
            hiddenButtonRef.current.click();  // Programmatically trigger the button click
          }

          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              ref.current.scrollTo({
                top: ref.current.scrollHeight,
                behavior: "smooth",
              });
            }
          }, 200);
        }}
      >
        <VoiceSessionComponent hiddenButtonRef={hiddenButtonRef} />

        <Messages ref={ref} />
        <Controls chatHistory={chatHistory} />
        <StartCall />
      </VoiceProvider>
    </div>
  );
}

// The component that uses useVoice and triggers session settings
function VoiceSessionComponent({ hiddenButtonRef }: { hiddenButtonRef: React.RefObject<HTMLButtonElement> }) {
  const { sendSessionSettings } = useVoice();

  return (
    <button
      ref={hiddenButtonRef}
      style={{ display: "none" }}  // Hidden button
      onClick={() => {
        console.log("Sending session settings programmatically...");
        sendSessionSettings({
          variables: {
            name: "skibidi rizzler", // Send the name "jeffery" as session settings
          },
        });
      }}
    >
      Send Session Settings
    </button>
  );
}
