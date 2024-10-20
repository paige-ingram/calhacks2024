import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Sun } from "lucide-react";
import { useState, useEffect } from "react";

// Define the type for wave objects
interface Wave {
  id: number;
  style: { left: string; top: string; width: string; height: string };
  type: string;
}

export default function StartCall() {
  const [showTitle, setShowTitle] = useState(true);
  const [waves, setWaves] = useState<Wave[]>([]);
  const { status, connect } = useVoice();
  const [buttonActive, setButtonActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitle(false);
      setButtonActive(true);
    }, 3000); // Show and hide after 3 sec

    return () => clearTimeout(timer);
  }, []);

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
      {showTitle ? (
        // Intro logo pop-in
        <div className="relative flex justify-center items-center" style={{ height: '100vh' }}>
          <motion.div
            className="absolute left-0 top-0"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            exit={{ width: 0 }}
            transition={{ duration: 2 }}
            style={{
              overflow: 'hidden',
              background: 'linear-gradient(to right, rgba(255, 215, 0, 0) 0%, rgba(255, 215, 0, 1) 50%, rgba(255, 215, 0, 0) 100%)'
            }}
          />
          <motion.img
            src="halo_logo.png" 
            alt="Halo logo"
            className="z-10" 
            initial={{ clipPath: 'inset(0 100% 0 0)' }} // Fade reveal, left to right
            animate={{ clipPath: 'inset(0 0 0 0)' }} 
            exit={{ clipPath: 'inset(0 100% 0 0)' }} 
            transition={{ duration: 2 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -60%)',
              width: 'auto', 
              height: 'auto', 
            }}
          />
        </div>
      ) : ( 

        status.value !== "connected" ? (
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
                  disabled={!buttonActive}
                  onClick={(e) => {
                    if (!buttonActive) return;
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
        ) : null
      )}
    </AnimatePresence>
  );
}