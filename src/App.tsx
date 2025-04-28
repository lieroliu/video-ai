import { useEffect, useState } from "react";
import { mockAiProcess } from "./api/mockAi";
import "./App.css";
import VideoPreview from "./components/VideoPreview";
import VideoTranscript from "./components/VideoTranscript";
import { TranscriptItem, TranscriptSection } from "./types";

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [sections, setSections] = useState<TranscriptSection[]>([]);
  const [highlights, setHighlights] = useState<TranscriptItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);

  // 當影片上傳後才呼叫 mockAiProcess
  useEffect(() => {
    if (videoUploaded) {
      setLoading(true);
      setSections([]);
      mockAiProcess().then((data) => {
        setSections(data.sections);
        setHighlights(data.highlights);
        setLoading(false);
      });
    }
  }, [videoUploaded]);

  const handleTimeUpdate = (seconds: number) => {
    setCurrentTime(seconds);
  };

  const handleVideoUpload = () => {
    setVideoUploaded(true);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="app-container">
      <div className="content">
        <div className="transcript-section">
          {!videoUploaded ? (
            <div>Please upload the video first.</div>
          ) : loading ? (
            <div>AI processing...</div>
          ) : (
            <VideoTranscript
              currentTime={currentTime}
              onItemClick={setCurrentTime}
              sections={sections}
            />
          )}
        </div>
        <div className="preview-section">
          <VideoPreview
            currentTime={formatTime(currentTime)}
            onTimeUpdate={handleTimeUpdate}
            highlights={highlights}
            onMarkerClick={(sec) => setCurrentTime(sec)}
            onVideoUpload={handleVideoUpload}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
