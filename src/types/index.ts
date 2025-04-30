export interface TranscriptItem {
  text: string;
  isHighlighted?: boolean;
  startSeconds: number;
  endSeconds: number;
}

export interface TranscriptSection {
  title: string;
  items: TranscriptItem[];
}

export interface AiTranscriptResponse {
  sections: TranscriptSection[];
  highlights: TranscriptItem[];
}

export interface VideoPreviewProps {
  currentTime: string;
  highlights: TranscriptItem[];
  onTimeUpdate: (time: number) => void;
  onVideoUpload?: () => void;
}

export interface VideoPlayerState {
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  videoUrl: string | null;
  volume: number;
  isMuted: boolean;
}
