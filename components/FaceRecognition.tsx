"use client";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

interface Props {
  onPersonDetected: (name: string) => void;
}

const FaceRecognition: React.FC<Props> = ({ onPersonDetected }) => {
  const webcamRef = useRef<Webcam>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [labeledDescriptors, setLabeledDescriptors] = useState<faceapi.LabeledFaceDescriptors[]>([]);
  const [scanning, setScanning] = useState<string | null>(null); // Keep track of scanning status

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Load models for face detection, landmarks, and recognition
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        
        setModelLoaded(true);
        console.log("Models loaded");
      } catch (error) {
        console.error("Failed to load models", error);
      }
    };
    loadModels();
  }, []);

  const captureAndRecognize = async () => {
    if (webcamRef.current && webcamRef.current.video && modelLoaded) {
      const videoElement = webcamRef.current.video;

      const detection = await faceapi
        .detectSingleFace(videoElement)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection && labeledDescriptors.length > 0) {
        const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
        const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
        console.log(`Detected person: ${bestMatch.toString()}`);
        onPersonDetected(bestMatch.toString());
      } else {
        console.log("No match found or no faces detected.");
      }
    } else {
      console.log("Models are still loading or webcam is not ready.");
    }
  };

  const scanNewPerson = async (name: string) => {
    if (webcamRef.current && webcamRef.current.video && modelLoaded) {
      const videoElement = webcamRef.current.video;
      
      const detection = await faceapi
        .detectSingleFace(videoElement)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        const newDescriptor = new faceapi.LabeledFaceDescriptors(name, [
          detection.descriptor,
        ]);
        setLabeledDescriptors((prev) => [...prev, newDescriptor]);
        console.log(`${name}'s face has been scanned.`);
        setScanning(null); // Stop scanning state
      } else {
        console.log(`Could not detect face for ${name}.`);
      }
    }
  };

  return (
    <div className="camera-container">
      <Webcam ref={webcamRef} style={{ width: "100%", height: "auto" }} />
      
      {/* Feedback when scanning */}
      {scanning && <p>Scanning face for {scanning}...</p>}
      
      <button onClick={captureAndRecognize} disabled={scanning !== null}>
        Identify Person
      </button>
      
      <button onClick={() => { setScanning("Person 1"); scanNewPerson("Person 1"); }} disabled={scanning !== null}>
        Scan Face - Person 1
      </button>
      
      <button onClick={() => { setScanning("Person 2"); scanNewPerson("Person 2"); }} disabled={scanning !== null}>
        Scan Face - Person 2
      </button>
    </div>
  );
};

export default FaceRecognition;
