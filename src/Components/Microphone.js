import React, { useState } from "react";
import "../assets/styles/Microphone.css"; // Make sure to include your CSS styles
import useAudioRecorder from "./AudioRecorder";
import TranscribeAudio from "../services/TranscribeAudio.js";
import Loader from "./Loader";

// Microphone.js

/**
 * Microphone component for recording and transcribing audio.
 */
const Microphone = () => {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();
  const [transcription, setTranscription] = useState("");
  const [loader, setLoader] = useState(false);

  /**
   * Handles the button click event.
   * If recording, stops recording and transcribes the audio.
   * If not recording, starts recording.
   */
  const handleButtonClick = async () => {
    if (isRecording) {
      // Stop recording and transcribe audio
      const { audioBlob, audioUrl } = await stopRecording();
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = async () => {
        setLoader(true);
        try {
          const transcript = await TranscribeAudio(audioBlob);
          setTranscription(transcript || "Unable to transcribe");
        } catch {
          setTranscription("Error in transcribing audio");
        } finally {
          setLoader(false);
        }
      };
    } else {
      // Start recording
      startRecording();
    }
  };

  return (
    <div className="microphone">
      <button
        id="recorder"
        className={isRecording ? "recording" : ""}
        onClick={handleButtonClick}
      >
        <img
          id="record"
          src="https://assets.codepen.io/3537853/record.svg"
          draggable="false"
          alt="Record"
        />
        <img
          id="arrow"
          src="https://assets.codepen.io/3537853/arrow.svg"
          draggable="false"
          alt="Arrow"
        />
      </button>
      <Loader visible={loader} />
      <div className="transcription">{transcription}</div>
    </div>
  );
};

export default Microphone;
