import { useState } from "react";
import "./App.css";
import ChatWindow from "./components/ChatWindow";
import Header from "./components/Header";
import RecordButton from "./components/RecordButton";
import axios from "axios";

function App() {
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const handleStopRecording = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("audio", blob, "audio.mp3");
    const response = await axios.post(
      "http://localhost:5000/api/chat",
      formData,
      {
        responseType: "blob",
      },
    );
    const url = URL.createObjectURL(response.data);
    setAudioUrl(url);
    
  };
  return (
    <>
      <div className="App flex flex-col items-center justify-between p-4 gap-6">
        <Header />
        <ChatWindow />
        {audioUrl && <audio src={audioUrl} controls autoPlay />}
        <RecordButton onStopRecording={handleStopRecording} />
      </div>
    </>
  );
}

export default App;
