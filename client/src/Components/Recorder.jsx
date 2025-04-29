import { useState } from "react";

function Recorder() {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [level, setLevel] = useState(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setAudioBlob(blob);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;
    const formData = new FormData();
    formData.append("audio", audioBlob);

    const response = await fetch("/api/analyze-audio", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    setLevel(result.level);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <button onClick={startRecording} className="btn">🎙️ Start</button>
        <button onClick={stopRecording} className="btn">⏹️ Stop</button>
        {recording && <div className="w-4 h-4 bg-red-500 rounded-full animate-ping"></div>}
      </div>
      <button onClick={uploadAudio} className="btn">Upload & Analyze</button>

      {level && (
        <div className="mt-4 text-lg">
          <strong>Level:</strong> {level.levelNumber}/10 ({level.CEFR})
        </div>
      )}
    </div>
  );
}

export default Recorder;