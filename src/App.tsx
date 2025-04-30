import { useEffect, useRef, useState } from "react";
import { aiTranscriptProcess } from "./api/aiTranscript";
import "./App.css";
import VideoPreview from "./components/VideoPreview";
import VideoTranscript from "./components/VideoTranscript";
import { TranscriptItem, TranscriptSection } from "./types";

function App() {
  const scrollTimerRef = useRef<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [sections, setSections] = useState<TranscriptSection[]>([]);
  const [highlights, setHighlights] = useState<TranscriptItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  // 當影片上傳後才呼叫 aiTranscriptProcess
  useEffect(() => {
    if (videoUploaded) {
      setLoading(true);
      setSections([]);
      aiTranscriptProcess().then((data) => {
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

  const handleScroll = () => {
    console.log("scroll");
    if (autoScroll) {
      setAutoScroll(false);
    }

    // 清除之前的計時器
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    // 設置新的計時器，5秒後重新啟用自動滾動
    scrollTimerRef.current = window.setTimeout(() => {
      setAutoScroll(true);
    }, 5000);
  };

  // 組件卸載時清除計時器
  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="app-container">
      <div className="content">
        <div className="transcript-section" onScroll={handleScroll}>
          {!videoUploaded ? (
            <div>Please upload the video first.</div>
          ) : loading ? (
            <div>AI processing...</div>
          ) : (
            <VideoTranscript
              currentTime={currentTime}
              onItemClick={setCurrentTime}
              sections={sections}
              autoScroll={autoScroll}
            />
          )}
        </div>
        <div className="preview-section">
          <VideoPreview
            currentTime={formatTime(currentTime)}
            onTimeUpdate={handleTimeUpdate}
            highlights={highlights}
            onVideoUpload={handleVideoUpload}
            sections={sections}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
