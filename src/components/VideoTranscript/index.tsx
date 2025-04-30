import React, { useEffect, useRef } from "react";
import { TranscriptSection } from "../../types";
import "./styles.css";
interface VideoTranscriptProps {
  currentTime: number;
  onItemClick?: (startSeconds: number) => void;
  sections: TranscriptSection[];
  autoScroll: boolean;
}

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

const VideoTranscript: React.FC<VideoTranscriptProps> = ({
  currentTime,
  onItemClick,
  sections,
  autoScroll,
}) => {
  const transcriptRef = useRef<HTMLDivElement>(null);
  const currentItemRef = useRef<HTMLDivElement>(null);

  const isCurrentTimeInRange = (start: number, end: number): boolean => {
    return currentTime >= start && currentTime < end;
  };

  useEffect(() => {
    if (currentItemRef.current && transcriptRef.current && autoScroll) {
      currentItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [autoScroll, currentTime]);

  return (
    <div className="transcript-container" ref={transcriptRef}>
      {sections.map((section, index) => (
        <div key={index} className="section">
          <h2>{section.title}</h2>
          {section.items.map((item, itemIndex) => {
            const isCurrent =
              item.startSeconds !== undefined &&
              item.endSeconds !== undefined &&
              isCurrentTimeInRange(item.startSeconds, item.endSeconds);
            return (
              <div
                key={itemIndex}
                ref={isCurrent ? currentItemRef : undefined}
                className={`transcript-item ${
                  item.isHighlighted ? "highlighted" : ""
                } ${isCurrent ? "current" : ""}`}
                onClick={() =>
                  item.startSeconds !== undefined &&
                  onItemClick?.(item.startSeconds)
                }
              >
                <span className="timestamp">
                  {formatTime(item.startSeconds)} ~{" "}
                  {formatTime(item.endSeconds)}
                </span>
                <span className="text">{item.text}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default VideoTranscript;
