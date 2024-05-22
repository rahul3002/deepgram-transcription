// src/App.js
import React from "react";
import Microphone from "./Components/Microphone";
import "../src/assets/styles/Microphone.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Deepgram Transcription</h1>
      </header>
      <Microphone />
    </div>
  );
}

export default App;
