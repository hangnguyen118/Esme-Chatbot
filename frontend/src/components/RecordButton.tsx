import { useRef, useState } from "react";

export default function RecordButton({
  onStopRecording,
}: {
  onStopRecording: (blob: Blob) => void;
}) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      onStopRecording(blob);
    };
    recorder.start();
    setRecording(true);
  };
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };
  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      className={`${recording ? "bg-red-500" : "bg-blue-500"} w-16 h-16 rounded-full text-3xl p-2 text-white flex items-center justify-center`}
    >
      {recording ? "❚❚" : "🎙️"}
    </button>
  );
}
