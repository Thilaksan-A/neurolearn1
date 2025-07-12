import { LearnerType } from "@/types";
import { useCallback, useState } from "react";

export function useTTS() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speak = useCallback(async (text: string, learnerType: LearnerType) => {
    setIsLoading(true);
    setError(null);

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

      // Set up audio event listeners
      audio.addEventListener("loadstart", () => {
        setIsLoading(false);
        setIsAudioPlaying(true);
      });

      audio.addEventListener("play", () => {
        setIsAudioPlaying(true);
      });

      audio.addEventListener("pause", () => {
        setIsAudioPlaying(false);
      });

      audio.addEventListener("ended", () => {
        setIsAudioPlaying(false);
        URL.revokeObjectURL(audioUrl);
      });

      audio.addEventListener("error", (e) => {
        console.error("Audio playback error:", e);
        setError("Failed to play audio");
        setIsAudioPlaying(false);
      });

      await audio.play();
    } catch (err) {
      console.error("TTS Error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { speak, isLoading, isAudioPlaying, error };
}
