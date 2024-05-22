import { useState, useRef } from "react";

// AudioRecorder.js

/**
 * Custom hook for audio recording functionality.
 * Returns an object with recording state and functions to start and stop recording.
 */
const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const audioChunksRef = useRef([]);
  const recorderRef = useRef(null);

  /**
   * Gets the media stream for audio recording.
   * @returns {Promise<MediaStream>} The media stream for audio recording.
   * @throws {Error} If there is an error accessing the media devices.
   */
  const getMediaStream = async () => {
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      console.error("Error accessing media devices.", error);
      throw error;
    }
  };

  /**
   * Initializes the media recorder with the given stream.
   * @param {MediaStream} stream - The media stream for audio recording.
   * @returns {MediaRecorder} The initialized media recorder.
   */
  const initializeRecorder = (stream) => {
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    audioChunksRef.current = [];

    // Event listener to collect audio data chunks
    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunksRef.current.push(event.data);
    });

    return mediaRecorder;
  };

  /**
   * Starts the audio recording.
   */
  const startRecording = async () => {
    const stream = await getMediaStream();
    const mediaRecorder = initializeRecorder(stream);

    mediaRecorder.start();
    setIsRecording(true);

    recorderRef.current = mediaRecorder;
  };

  /**
   * Stops the audio recording and returns the recorded audio blob and URL.
   * @returns {Promise<{ audioBlob: Blob, audioUrl: string }>} The recorded audio blob and URL.
   */
  const stopRecording = () => {
    return new Promise((resolve) => {
      const mediaRecorder = recorderRef.current;

      // Event listener to handle recording stop
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        resolve({ audioBlob, audioUrl });
      });

      mediaRecorder.stop();
      setIsRecording(false);
    });
  };

  return { isRecording, startRecording, stopRecording };
};

export default useAudioRecorder;
