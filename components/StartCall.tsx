import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Sun } from "lucide-react";
import { useState } from "react";

// Define the type for wave objects
interface Wave {
  id: number;
  style: { left: string; top: string; width: string; height: string };
  type: string;
}

export default function StartCall() {
  const { status, connect } = useVoice();
  const [waves, setWaves] = useState<Wave[]>([]);

  const createWave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const waveId = Date.now();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const maxDimension = Math.max(viewportWidth, viewportHeight);
    const waveSize = maxDimension * 2; // Large enough to cover the entire screen

    const waveStyle = {
      left: `${e.clientX - waveSize / 2}px`,
      top: `${e.clientY - waveSize / 2}px`,
      width: `${waveSize}px`,
      height: `${waveSize}px`,
    };

    // Create multiple waves with different classes
    setWaves((prevWaves) => [
      ...prevWaves,
      { id: waveId, style: waveStyle, type: "primary" },
      { id: waveId + 1, style: waveStyle, type: "secondary" },
      { id: waveId + 2, style: waveStyle, type: "tertiary" },
    ]);

    // Remove the waves after the animation ends
    setTimeout(() => {
      setWaves((prevWaves) =>
        prevWaves.filter(
          (wave) => wave.id !== waveId && wave.id !== waveId + 1 && wave.id !== waveId + 2
        )
      );
    }, 1200);
  };

  const fetchSummary = async () => {
    try {
      console.log("/api/gemini"); // Using relative URL
      const response = await fetch("/api/gemini"); // No need to prepend the base URL
      const data = await response.json();
      console.log("Summary:", JSON.stringify(data)); // Log the summary to the console
    } catch (error) {
      console.error("Failed to fetch summary:", error);
    }
  };

  return (
    <AnimatePresence>
      {status.value !== "connected" ? (
        <motion.div
          className={"fixed inset-0 p-4 flex items-center justify-center bg-background"}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={{
            initial: { opacity: 0 },
            enter: { opacity: 1 },
            exit: { opacity: 0 },
          }}
        >
          {/* Northern Lights Background */}
          <div className="northern-lights"></div>

          <AnimatePresence>
            <motion.div
              variants={{
                initial: { scale: 0.5 },
                enter: { scale: 1 },
                exit: { scale: 0.5 },
              }}
            >
              <Button
                className={"glow-button z-50 flex items-center gap-2 px-6 py-3 relative"}
                onClick={(e) => {
                  createWave(e);
                  connect()
                    .then(() => {})
                    .catch(() => {})
                    .finally(() => {});
                }}
              >
                <span>
                  <Sun
                    className={"size-5 opacity-70 text-white"}
                    strokeWidth={2}
                    stroke={"currentColor"}
                  />
                </span>
                <span className="font-semibold">Launch Halo</span>
              </Button>
              <Button
                className={"z-50 flex items-center gap-1.5"}
                onClick={fetchSummary}
              >
                <span>Gemini</span>
              </Button>
            </motion.div>
          </AnimatePresence>

          {/* Render the waves, which will cover the whole page and have multiple ripples */}
          {waves.map((wave) => (
            <span
              key={wave.id}
              className={`wave-effect ${wave.type}`}
              style={wave.style}
            ></span>
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}