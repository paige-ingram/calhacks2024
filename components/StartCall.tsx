import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";

export default function StartCall() {
  const { status, connect } = useVoice();

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
          <AnimatePresence>
            <motion.div
              variants={{
                initial: { scale: 0.5 },
                enter: { scale: 1 },
                exit: { scale: 0.5 },
              }}
            >
              <Button
                className={"z-50 flex items-center gap-1.5"}
                onClick={() => {
                  connect()
                    .then(() => {})
                    .catch(() => {})
                    .finally(() => {});
                }}
              >
                <span>
                  <Phone
                    className={"size-4 opacity-50"}
                    strokeWidth={2}
                    stroke={"currentColor"}
                  />
                </span>
                <span>Start Call</span>
              </Button>
              <Button
                className={"z-50 flex items-center gap-1.5"}
                onClick={fetchSummary}
              >
                <span>Gemini</span>
              </Button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}