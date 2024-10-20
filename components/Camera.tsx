import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import './Camera.css';

const Camera = ({ onPersonDetected }: { onPersonDetected: () => void }) => {
  const webcamRef = useRef<Webcam>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [personDetected, setPersonDetected] = useState(false);

  // Load COCO-SSD model
  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  // Detect motion (i.e., detect a person using COCO-SSD)
  const detectMotion = async () => {
    if (webcamRef.current && webcamRef.current.video?.readyState === 4 && model) {
      const video = webcamRef.current.video;
      const predictions = await model.detect(video);

      // Check if any of the predictions detect a person
      const personFound = predictions.some(
        (prediction) => prediction.class === "person"
      );

      if (personFound) {
        console.log("Person detected:", predictions);
        setPersonDetected(true); // Set state to detected
        onPersonDetected(); // Notify parent component
      }
    }
  };

  // Continuously detect motion
  useEffect(() => {
    const intervalId = setInterval(detectMotion, 1000); // Check every second
    return () => clearInterval(intervalId);
  }, [model]);

  return (
    <div className={`camera-container ${personDetected ? 'person-detected' : ''}`}>
      {!personDetected && (
        <>
          <Webcam ref={webcamRef} className="webcam-view" />
          <p className="detecting-text">Detecting motion...</p>
        </>
      )}
    </div>
  );
};

export default Camera;
