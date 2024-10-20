import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const GeminiPage = () => {
  const [summary, setSummary] = useState<string>("");

  // Fetch the summary when the page loads
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        console.log("/api/gemini"); // Using relative URL
        const response = await fetch("/api/gemini"); // Fetch Gemini data
        const data = await response.json();
        const parsedSummary = JSON.parse(data.summary).response.candidates[0].content.parts[0].text;
        setSummary(parsedSummary); // Set summary in state
      } catch (error) {
        console.error("Failed to fetch summary:", error);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div
      className="relative flex justify-center items-center min-h-screen"
      style={{
        background: "linear-gradient(135deg, rgba(147,255,243,1) 0%, rgba(249,161,255,1) 100%)",
      }}
    >
      <motion.div
        className="bg-white rounded-lg p-8 shadow-lg text-black"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "80%", maxWidth: "600px", minHeight: "300px" }}
      >
        <h2 className="text-2xl font-bold mb-4">Gemini Insights</h2>
        {summary ? (
          <p className="text-lg leading-relaxed">{summary}</p>
        ) : (
          <p className="text-lg leading-relaxed">Loading...</p>
        )}
      </motion.div>
    </div>
  );
};

export default GeminiPage;
