// TranscriptionService.js
import axios from "axios";

/**
 * Transcribes audio using the Deepgram API.
 *
 * @param {Blob} audioBlob - The audio data to transcribe.
 * @returns {Promise<string>} The transcription result.
 * @throws {Error} If the transcription request fails.
 */
const TranscribeAudio = async (audioBlob) => {
  // Define the headers for the API request
  const headers = {
    // The Authorization header includes a token for the Deepgram API
    Authorization: `Token 075afe8966d1085f8ca93dcb2b2a6c603e9a2f6c`,
    // The Content-Type header indicates that we're sending audio data in WAV format
    "Content-Type": "audio/wav",
  };

  try {
    // Make a POST request to the Deepgram API
    // The audio data to transcribe is sent in the body of the request
    // The headers defined above are included in the request
    const response = await axios.post(
      "https://api.deepgram.com/v1/listen",
      audioBlob,
      { headers }
    );
    // Return the transcription result from the response
    return response.data?.results?.channels[0]?.alternatives[0]?.transcript;
  } catch (error) {
    // Log the error and re-throw it to be handled by the caller
    console.error("Transcription error", error);
    throw error;
  }
};

export default TranscribeAudio;
