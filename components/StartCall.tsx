import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Sun, Eye, Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Camera from "./Camera"; // Import Camera component for detecting a person
import Link from "next/link";

// Define the type for wave objects
interface Wave {
  id: number;
  style: { left: string; top: string; width: string; height: string };
  type: string;
}

export default function StartCall() {
  const [showTitle, setShowTitle] = useState(true);
  const [waves, setWaves] = useState<Wave[]>([]);
  const { status, connect } = useVoice(); // One hook for voice management
  const [buttonActive, setButtonActive] = useState(false);
  const [showCamera, setShowCamera] = useState(false); // Show camera after clicking 'Launch'
  const [personDetected, setPersonDetected] = useState(false); // Track person detection
  const [renderButtons, setRenderButtons] = useState(false); // Control button rendering after delay
  const haloButtonRef = useRef<HTMLButtonElement>(null); // Ref to auto-click 'Launch Halo' button

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitle(false);
      setButtonActive(true);
    }, 3000); // Show and hide after 3 sec
    return () => clearTimeout(timer);
  }, []);

  const createWave = (e?: React.MouseEvent<HTMLButtonElement>) => {
    const waveId = Date.now();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const maxDimension = Math.max(viewportWidth, viewportHeight);

    const waveSize = maxDimension * 2; // Large enough to cover the entire screen
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;

    const waveStyle = {
      left: `${centerX - waveSize / 2}px`,
      top: `${centerY - waveSize / 2}px`,
      width: `${waveSize}px`,
      height: `${waveSize}px`,
    };

    setWaves((prevWaves) => [
      ...prevWaves,
      { id: waveId, style: waveStyle, type: "primary" },
      { id: waveId + 1, style: waveStyle, type: "secondary" },
      { id: waveId + 2, style: waveStyle, type: "tertiary" },
    ]);

    setTimeout(() => {
      setWaves((prevWaves) =>
        prevWaves.filter(
          (wave) => wave.id !== waveId && wave.id !== waveId + 1 && wave.id !== waveId + 2
        )
      );
    }, 1200);
  };

  // Simulate click on 'Launch Halo' after person detection
  useEffect(() => {
    if (personDetected && haloButtonRef.current) {
      haloButtonRef.current.click(); // Automatically click the 'Launch Halo' button
    }
  }, [personDetected]);

  // Function to show camera and detect a person
  const handleLaunchClick = () => {
    setShowCamera(true);
  };

  // Function to trigger when a person is detected by the camera
  const handlePersonDetected = () => {
    setPersonDetected(true); // Update state when person is detected
    setShowCamera(false); // Hide the camera after detection
    
    // Delay 2 seconds before showing the buttons
    setTimeout(() => {
      setRenderButtons(true); // Show buttons after 2 seconds
    }, 2000);
  };

  const fetchSummary = async () => {
    try {
      console.log("/api/gemini"); // Using relative URL
      const response = await fetch("/api/gemini"); // No need to prepend the base URL
      const data = await response.json();
      const summary = JSON.parse(data.summary);
      console.log("Summary:", summary.response.candidates[0].content.parts[0].text); // Log the summary to the console
    } catch (error) {
      console.error("Failed to fetch summary:", error);
    }
  };

  return (
    <AnimatePresence>
      {showTitle ? (
        // Intro logo pop-in
        <div className="relative flex justify-center items-center" style={{ height: "100vh" }}>
          <motion.div
            className="absolute left-0 top-0"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            exit={{ width: 0 }}
            transition={{ duration: 2 }}
            style={{
              overflow: "hidden",
              background:
                "linear-gradient(to right, rgba(255, 215, 0, 0) 0%, rgba(255, 215, 0, 1) 50%, rgba(255, 215, 0, 0) 100%)",
            }}
          />
          <motion.img
            src="halo_logo.png"
            alt="Halo logo"
            className="z-10"
            initial={{ clipPath: "inset(0 100% 0 0)" }} // Fade reveal, left to right
            animate={{ clipPath: "inset(0 0 0 0)" }}
            exit={{ clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: 2 }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -60%)",
              width: "auto",
              height: "auto",
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
                {/* Camera for detecting a person */}
                {showCamera && <Camera onPersonDetected={handlePersonDetected} />}

                {/* Arrange buttons in the center */}
                <motion.div
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  {/* Launch button */}
                  {!personDetected && !showCamera && (
                    <Button
                      className={
                        "glow-button z-50 flex items-center justify-center gap-2 p-8 rounded-full relative hover:scale-110 transition-all duration-300 ease-in-out text-xl"
                      }
                      style={{ width: "300px" }}
                      onClick={handleLaunchClick}
                    >
                      <Sun className={"size-5 opacity-70 text-white"} strokeWidth={2} stroke={"currentColor"} />
                      <span className="font-semibold">Launch Halo</span>
                    </Button>
                  )}

                  {/* Launch Halo button */}
                  {personDetected && (
                    <Button
                      className={
                        "glow-button z-50 flex items-center justify-center gap-2 p-8 rounded-full relative hover:scale-110 transition-all duration-300 ease-in-out text-xl"
                      }
                      style={{ width: "300px" }}
                      ref={haloButtonRef} // Reference to auto-click
                      onClick={(e) => {
                        createWave(e);
                        connect()
                          .then(() => {})
                          .catch(() => {})
                          .finally(() => {});
                      }}
                    >
                      <Sun className={"size-5 opacity-70 text-white"} strokeWidth={2} stroke={"currentColor"} />
                      <span className="font-semibold">Launch Halo</span>
                    </Button>
                  )}

                  {/* Render buttons after delay */}
                  {renderButtons && (
                    <div className="flex justify-center gap-8">
                      {/* Emotional History button */}
                      <Link href="/emotional-history">
                        <Button
                          className={
                            "glow-button z-50 flex items-center justify-center gap-2 p-8 rounded-full hover:scale-110 transition-all duration-300 ease-in-out text-xl"
                          }
                          style={{ width: "300px" }}
                          onClick={(e) => createWave(e)}
                        >
                          <Clock className={"size-5 opacity-70 text-white"} strokeWidth={2} stroke={"currentColor"} />
                          <span className="font-semibold">Emotional History</span>
                        </Button>
                      </Link>

                      {/* Gemini Insights button */}
                      <Link href="/gemini">
  <Button
    className={
      "glow-button z-50 flex items-center justify-center gap-1.5 p-8 rounded-full hover:scale-110 transition-all duration-300 ease-in-out text-xl"
    }
    style={{ width: "300px" }}
    onClick={(e) => createWave(e)}
  >
    <Eye className={"size-5 opacity-70 text-white"} strokeWidth={2} stroke={"currentColor"} />
    <span className="font-semibold">Gemini Insights</span>
  </Button>
</Link>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Render the waves, which will cover the page and have multiple ripples */}
            {waves.map((wave) => (
              <span key={wave.id} className={`wave-effect ${wave.type}`} style={wave.style}></span>
            ))}
          </motion.div>
        ) : null
      )}
    </AnimatePresence>
  );
}
