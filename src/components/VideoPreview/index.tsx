import React, { useEffect, useRef, useState } from "react";
import {
  TranscriptSection,
  VideoPlayerState,
  VideoPreviewProps,
} from "../../types";
import "./styles.css";

const VideoPreview: React.FC<
  VideoPreviewProps & { sections?: TranscriptSection[] }
> = ({
  currentTime,
  onTimeUpdate,
  onVideoUpload,
  highlights = [],
  sections = [],
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    progress: 0,
    duration: 0,
    currentTime: 0,
    videoUrl: null,
    volume: 1,
    isMuted: false,
  });
  const [showSubtitle, setShowSubtitle] = useState(true);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPlayerState((prev) => ({
        ...prev,
        videoUrl: url,
        isPlaying: false,
        progress: 0,
        currentTime: 0,
      }));
      if (onVideoUpload) onVideoUpload();
    }
  };

  const togglePlay = () => {
    if (playerState.isPlaying) {
      setPlayerState((prev) => ({ ...prev, isPlaying: false }));
      if (videoRef.current) {
        videoRef.current.pause();
      }
    } else {
      setPlayerState((prev) => ({ ...prev, isPlaying: true }));
      if (videoRef.current) {
        videoRef.current.play();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setPlayerState((prev) => ({
        ...prev,
        progress,
        currentTime: videoRef.current!.currentTime,
      }));
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setPlayerState((prev) => ({
        ...prev,
        duration: videoRef.current!.duration,
      }));
    }
  };

  const handleVideoProgress = (event: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = event.currentTarget;
    const pos =
      (event.pageX - progressBar.offsetLeft) / progressBar.offsetWidth;
    if (videoRef.current) {
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(
          videoRef.current.currentTime + seconds,
          videoRef.current.duration
        )
      );
    }
  };

  useEffect(() => {
    return () => {
      if (playerState.videoUrl) {
        URL.revokeObjectURL(playerState.videoUrl);
      }
    };
  }, [playerState.videoUrl]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = playerState.volume;
      videoRef.current.muted = playerState.isMuted;
    }
  }, [playerState.volume, playerState.isMuted, playerState.videoUrl]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.remove("drag-over");
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setPlayerState((prev) => ({
        ...prev,
        videoUrl: url,
        isPlaying: false,
        progress: 0,
        currentTime: 0,
      }));
      if (onVideoUpload) onVideoUpload();
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setPlayerState((prev) => ({
        ...prev,
        volume: newVolume,
        isMuted: newVolume === 0,
      }));
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !playerState.isMuted;
      videoRef.current.muted = newMuted;
      setPlayerState((prev) => ({
        ...prev,
        isMuted: newMuted,
        volume: newMuted ? 0 : prev.volume || 1,
      }));
      if (videoRef.current) {
        videoRef.current.volume = newMuted ? 0 : playerState.volume || 1;
      }
    }
  };

  // 外部 currentTime 變動時才跳段
  useEffect(() => {
    if (videoRef.current && currentTime) {
      const [min, sec] = currentTime.split(":").map(Number);
      const appTime = min * 60 + sec;
      if (Math.abs(appTime - videoRef.current.currentTime) > 0.5) {
        videoRef.current.currentTime = appTime;
      }
    }
  }, [currentTime]);

  const getCurrentSubtitle = () => {
    if (!sections.length || playerState.currentTime === undefined) return null;

    for (const section of sections) {
      for (const item of section.items) {
        if (
          item.startSeconds !== undefined &&
          item.endSeconds !== undefined &&
          playerState.currentTime >= item.startSeconds &&
          playerState.currentTime <= item.endSeconds
        ) {
          return { text: item.text, sectionTitle: section.title };
        }
      }
    }
    return null;
  };

  const currentSubtitle = getCurrentSubtitle();

  const toggleSubtitle = () => {
    setShowSubtitle(!showSubtitle);
  };

  return (
    <div className="video-preview-container">
      <div
        className="video-preview"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {playerState.videoUrl ? (
          <div>
            {showSubtitle && currentSubtitle && (
              <div className="subtitle-container">
                <div className="subtitle-text">{currentSubtitle.text}</div>
              </div>
            )}
            <video
              ref={videoRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              src={playerState.videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div
            className="video-placeholder"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="material-icons upload-icon">cloud_upload</span>
            <p className="upload-text">點擊或拖放影片至此處</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </div>
        )}
      </div>

      <div className="video-controls">
        <button
          className="control-button"
          onClick={() => skipTime(-10)}
          disabled={!playerState.videoUrl}
        >
          <span className="material-icons">skip_previous</span>
        </button>
        <button
          className="control-button"
          onClick={togglePlay}
          disabled={!playerState.videoUrl}
        >
          <span className="material-icons">
            {playerState.isPlaying ? "pause" : "play_arrow"}
          </span>
        </button>
        <button
          className="control-button"
          onClick={() => skipTime(10)}
          disabled={!playerState.videoUrl}
        >
          <span className="material-icons">skip_next</span>
        </button>
        <div className="volume-control">
          <button
            className="control-button"
            onClick={toggleMute}
            disabled={!playerState.videoUrl}
          >
            <span className="material-icons">
              {playerState.isMuted || playerState.volume === 0
                ? "volume_off"
                : playerState.volume < 0.5
                ? "volume_down"
                : "volume_up"}
            </span>
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={playerState.volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
        <button
          className="control-button"
          onClick={toggleSubtitle}
          disabled={!playerState.videoUrl}
          title={showSubtitle ? "隱藏字幕" : "顯示字幕"}
        >
          <span className="material-icons">
            {showSubtitle ? "subtitles" : "subtitles_off"}
          </span>
        </button>
        <div className="time-display">
          {formatTime(playerState.currentTime)} /{" "}
          {formatTime(playerState.duration)}
        </div>
      </div>
      <div
        className="timeline"
        onClick={handleVideoProgress}
        style={{ cursor: playerState.videoUrl ? "pointer" : "default" }}
      >
        <div
          className="timeline-progress"
          style={{ width: `${playerState.progress}%` }}
        ></div>
        <div className="timeline-markers">
          {highlights.map((marker, index) => {
            if (!playerState.duration) return null;

            const startTime = Math.max(0, marker.startSeconds);
            const endTime = Math.min(marker.endSeconds, playerState.duration);

            // 確保時間範圍有效
            if (startTime >= endTime || startTime >= playerState.duration) {
              return null;
            }

            const left = (startTime / playerState.duration) * 100;
            const width = ((endTime - startTime) / playerState.duration) * 100;

            return (
              <div
                key={index}
                className="timeline-marker-bar"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  position: "absolute",
                  top: "0",
                  height: "100%",
                  background: "#4a76f5",
                  borderRadius: "4px",
                  opacity: marker.isHighlighted ? 0.8 : 0.4,
                  zIndex: 2,
                  cursor: "pointer",
                }}
                title={`${marker.text} (${formatTime(startTime)} - ${formatTime(
                  endTime
                )})`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
