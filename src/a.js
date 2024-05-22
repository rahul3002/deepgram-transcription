import React, { useState, useRef } from "react";
import "./Microphone.css"; // Make sure to include your CSS styles
import axios from "axios";
import { Blocks } from "react-loader-spinner";

const Microphone = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [loader, setLoader] = useState(false);
  const recorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const recordAudio = () => {
    return new Promise(async (resolve) => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      }); // Set the desired format
      audioChunksRef.current = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunksRef.current.push(event.data);
      });

      const start = () => {
        mediaRecorder.start();
        setIsRecording(true);
      };

      const stop = () => {
        return new Promise((resolve) => {
          mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/webm",
            }); // Set the desired format
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            const play = () => {
              audio.play();
              audio.onended = () => {
                transcribeAudio(audioBlob);
              };
            };
            resolve({ audioBlob, audioUrl, play });
          });
          mediaRecorder.stop();
          setIsRecording(false);
        });
      };

      resolve({ start, stop });
    });
  };

  const transcribeAudio = async (audioBlob) => {
    setLoader(true);
    try {
      const headers = {
        Authorization: `Token 075afe8966d1085f8ca93dcb2b2a6c603e9a2f6c`,
        "Content-Type": "audio/wav",
      };

      // Make the POST request using axios
      await axios
        .post("https://api.deepgram.com/v1/listen", audioBlob, {
          headers: headers,
        })
        .then((response) => {
          setTranscription(
            response.data?.results?.channels[0]?.alternatives[0]?.transcript
          ); // Handle response data
        })
        .catch((error) => {
          setTranscription("Unable to transcribe"); // Handle errors
        })
        .finally(() => {
          setLoader(false);
        });
    } catch (error) {
      setTranscription("Error in transcribing audio");
    }
  };

  const startRecording = async () => {
    recorderRef.current = await recordAudio();
    recorderRef.current.start();
  };

  const stopRecording = async () => {
    const audio = await recorderRef.current.stop();
    audio.play();
  };

  const handleButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
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
      {loader && (
        <Blocks
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          visible={true}
        />
      )}
      <div className="transcription">{transcription}</div>
    </div>
  );
};

export default Microphone;
