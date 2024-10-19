"use client";


import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const Camera = () => {
  const webcamRef = useRef<Webcam>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);

  // Load COCO-SSD model
  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  // Detect motion using COCO-SSD
  const detectMotion = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video?.readyState === 4 &&
      model
    ) {
      const video = webcamRef.current.video;
      const predictions = await model.detect(video);

      if (predictions.length > 0) {
        console.log("Motion detected:", predictions);
      }
    }
  };

  // Set up a loop to continuously detect motion
  useEffect(() => {
    const intervalId = setInterval(detectMotion, 1000); // Check every second
    return () => clearInterval(intervalId);
  }, [model]);

  return (
    <div className="camera-container">
      <Webcam ref={webcamRef} style={{ width: "100%", height: "auto" }} />
      <p>Webcam Active. Detecting Motion...</p>
    </div>
  );
};

export default Camera;
