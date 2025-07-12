import { useTTS } from "@/hooks";
import { LearnerType } from "@/types";
import { Pause, Play, Volume2, XCircle } from "lucide-react";
import { Button } from "./ui/button";

interface SpeakerButtonProps {
  textToSpeak: string;
  learnerType: LearnerType;
  className?: string;
}

const SpeakerButton = ({
  textToSpeak,
  learnerType,
  className = "",
}: SpeakerButtonProps) => {
  const tts = useTTS();
  const {
    isLoading,
    isAudioPlaying,
    currentTime,
    duration,
    formatTime,
    audioRef,
  } = tts;

  const useSpeakerButtonLogic = () => {
    const handleMainButtonClick = () => {
      if (isAudioPlaying) {
        tts.togglePlayPause();
      } else if (audioRef.current) {
        tts.resumeAudio();
      } else {
        tts.speak(textToSpeak, learnerType);
      }
    };

    const getAriaLabel = () => {
      if (isLoading) return "Generating audio...";
      if (isAudioPlaying) return "Pause audio";
      if (audioRef.current) return "Resume audio";
      return "Listen to lesson content";
    };

    return { handleMainButtonClick, getAriaLabel };
  };

  const { handleMainButtonClick, getAriaLabel } = useSpeakerButtonLogic();

  return (
    <div className={`relative group ${className}`}>
      <MainButton
        onClick={handleMainButtonClick}
        loading={isLoading}
        ariaLabel={getAriaLabel()}
        isPlaying={isAudioPlaying}
      />

      <AudioControls
        isPlaying={isAudioPlaying}
        onStop={tts.stopAudio}
        currentTime={currentTime}
        duration={duration}
        formatTime={formatTime}
      />
    </div>
  );
};

const MainButton = ({
  onClick,
  loading,
  ariaLabel,
  isPlaying,
}: {
  onClick: () => void;
  loading: boolean;
  ariaLabel: string;
  isPlaying: boolean;
}) => (
  <Button
    variant="outline"
    size="lg"
    onClick={onClick}
    loading={loading}
    className="h-12 w-12 rounded-full hover:bg-blue-50 focus:ring-4 focus:ring-blue-300 bg-transparent transition-all duration-200 relative overflow-hidden"
    aria-label={ariaLabel}
  >
    <ButtonIcon loading={loading} isPlaying={isPlaying} />
  </Button>
);

const ButtonIcon = ({
  loading,
  isPlaying,
}: {
  loading: boolean;
  isPlaying: boolean;
}) => {
  if (loading) {
    return (
      <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full" />
    );
  }

  if (isPlaying) {
    return (
      <div className="relative z-10">
        <Volume2 className="h-6 w-6 text-blue-600 group-hover:opacity-0 transition-opacity duration-200" />
        <Pause className="h-6 w-6 text-blue-600 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
    );
  }

  return (
    <div className="relative z-10">
      <Volume2 className="h-6 w-6 text-slate-600 group-hover:opacity-0 transition-opacity duration-200" />
      <Play className="h-6 w-6 text-blue-600 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  );
};

const AudioControls = ({
  isPlaying,
  onStop,
  currentTime,
  duration,
  formatTime,
}: {
  isPlaying: boolean;
  onStop: () => void;
  currentTime: number;
  duration: number;
  formatTime: (time: number) => string;
}) => {
  if (!isPlaying) return null;

  return (
    <>
      <Button
        onClick={onStop}
        variant="ghost"
        size="sm"
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border-2 border-slate-300 hover:bg-red-50 hover:border-red-300 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
        aria-label="Stop audio"
      >
        <XCircle className="h-4 w-4 text-slate-500 hover:text-red-500" />
      </Button>

      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </>
  );
};

export default SpeakerButton;
