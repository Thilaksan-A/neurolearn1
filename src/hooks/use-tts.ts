import { LearnerType } from "@/types";
import { useCallback, useRef, useState } from "react";

export function useTTS() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // Progress as percentage (0-100)
  const [currentTime, setCurrentTime] = useState(0); // Current time in seconds
  const [duration, setDuration] = useState(0); // Total duration in seconds
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string, learnerType: LearnerType) => {
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    if (!text || !learnerType) {
      setError("Text and learnerType are required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, learnerType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Set up audio event listeners
      audio.addEventListener("loadstart", () => {
        setIsLoading(false);
      });

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });

      audio.addEventListener("timeupdate", () => {
        const current = audio.currentTime;
        const total = audio.duration;
        setCurrentTime(current);
        if (total > 0) {
          setProgress((current / total) * 100);
        }
      });

      audio.addEventListener("play", () => {
        setIsAudioPlaying(true);
      });

      audio.addEventListener("pause", () => {
        setIsAudioPlaying(false);
      });

      audio.addEventListener("ended", () => {
        setIsAudioPlaying(false);
        setProgress(100);
        setCurrentTime(0);
        setDuration(0);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      });

      audio.addEventListener("error", (e) => {
        console.error("Audio playback error:", e);
        setError("Failed to play audio");
        setIsAudioPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        setDuration(0);
        audioRef.current = null;
      });

      await audio.play();
    } catch (err) {
      console.error("TTS Error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pauseAudio = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, []);

  const resumeAudio = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAudioPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      audioRef.current = null;
    }
  }, []);

  const seekTo = useCallback(
    (percentage: number) => {
      if (audioRef.current && duration > 0) {
        const newTime = (percentage / 100) * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        setProgress(percentage);
      }
    },
    [duration]
  );

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        resumeAudio();
      } else {
        pauseAudio();
      }
    }
  }, [pauseAudio, resumeAudio]);

  // Helper function to format time
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    speak,
    pauseAudio,
    resumeAudio,
    stopAudio,
    togglePlayPause,
    seekTo,
    isLoading,
    isAudioPlaying,
    error,
    progress,
    currentTime,
    duration,
    formatTime,
    audioRef,
  };
}
