"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTTS } from "@/hooks";
import {
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  Timer,
  Volume2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// type LearningStyle = "visual" | "reading" | null
// type AnswerFeedback = "correct" | "incorrect" | null

const questions = [
  {
    question: "What is it called when water turns into vapor?",
    options: [
      { id: "a", text: "Evaporation", isCorrect: true },
      { id: "b", text: "Condensation", isCorrect: false },
      { id: "c", text: "Precipitation", isCorrect: false },
      { id: "d", text: "Collection", isCorrect: false },
    ],
  },
  {
    question:
      "What process in the water cycle changes water vapor into liquid water?",
    options: [
      { id: "a", text: "Evaporation", isCorrect: false },
      { id: "b", text: "Condensation", isCorrect: true },
      { id: "c", text: "Precipitation", isCorrect: false },
      { id: "d", text: "Collection", isCorrect: false },
    ],
  },
  {
    question:
      "Which part of the water cycle is responsible for water entering the ground and becoming groundwater?",
    options: [
      { id: "a", text: "Evaporation", isCorrect: false },
      { id: "b", text: "Condensation", isCorrect: false },
      { id: "c", text: "Precipitation", isCorrect: false },
      { id: "d", text: "Collection", isCorrect: true },
    ],
  },
];

export default function LessonScreen() {
  const [showAdaptiveContent, setShowAdaptiveContent] = useState(false);
  //   const [learningStyle, setLearningStyle] = useState<LearningStyle>("visual") // Simulated from sign-up
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];
  const router = useRouter();

  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerPhase, setTimerPhase] = useState("focus");
  const intervalRef = useRef(null);
  const [showTimerPopout, setShowTimerPopout] = useState(false);
  const { speak, isLoading, error } = useTTS();

  const handleHelpMe = () => {
    setShowAdaptiveContent(true);
  };

  const handleAnswerSelect = (optionId) => {
    setSelectedAnswer(optionId);
    const selectedOption = currentQuestion.options.find(
      (option) => option.id === optionId
    );
    setFeedback(selectedOption?.isCorrect ? "correct" : "incorrect");
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setFeedback(null);
  };

  const handleAudioPlay = () => {
    const learningStyle = "visual"; // Simulated from sign-up
    const textToSpeak = `
    THE WATER CYCLE.[pause]
    The water cycle shows how water moves through our planet.
    First, the sun heats up water in rivers, lakes, and oceans. This water becomes
    vapor and rises into the air — this is called evaporation. The water vapor cools
    down and turns into tiny drops to form clouds — this is called condensation.
    When the clouds get heavy, the water falls back to the ground as rain — this is
    called precipitation. Water then flows back into rivers, lakes, and oceans —
    and the cycle starts again!`;
    speak(textToSpeak, learningStyle);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setCurrentTime(pomodoroTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isTimerRunning && currentTime > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            // Timer completed - could add notification here
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning, currentTime]);

  const renderAdaptiveContent = () => {
    if (!showAdaptiveContent) return null;

    if (learningStyle === "visual") {
      return (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            Visual Guide
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-4xl mb-2">☀️💧</div>
              <p className="text-sm font-medium">Evaporation</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-4xl mb-2">☁️</div>
              <p className="text-sm font-medium">Condensation</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-4xl mb-2">🌧️</div>
              <p className="text-sm font-medium">Precipitation</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-4xl mb-2">🏞️</div>
              <p className="text-sm font-medium">Collection</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">
          Key Definitions
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-lg">
            <p className="font-medium text-slate-800">Evaporation:</p>
            <p className="text-slate-600">
              When liquid water changes into invisible water vapor due to heat.
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="font-medium text-slate-800">Condensation:</p>
            <p className="text-slate-600">
              When water vapor cools and changes back into tiny water droplets.
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="font-medium text-slate-800">Precipitation:</p>
            <p className="text-slate-600">
              When water falls from clouds as rain, snow, or hail.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-4 hover:bg-slate-100 focus:ring-4 focus:ring-blue-300 bg-transparent"
              aria-label="Go back to subjects"
              onClick={() => router.push("/Homepage")}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Science
            </Button>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Lesson {currentQuestionIndex + 1} of 3
            </Badge>
            <Button
              onClick={() => setShowTimerPopout(true)}
              variant="outline"
              size="lg"
              className={`h-12 px-4 hover:bg-blue-50 focus:ring-4 focus:ring-blue-300 bg-transparent relative ${
                isTimerRunning ? "border-blue-400 bg-blue-50" : ""
              }`}
              aria-label={
                isTimerRunning
                  ? `Focus timer running: ${formatTime(currentTime)} remaining`
                  : "Open focus timer"
              }
            >
              <Timer
                className={`h-5 w-5 mr-2 ${
                  isTimerRunning ? "text-blue-600" : "text-blue-600"
                }`}
              />
              {isTimerRunning ? (
                <div className="flex flex-col items-start">
                  <span className="text-xs text-blue-600 font-medium leading-tight">
                    Focus Time
                  </span>
                  <span className="text-sm font-bold text-blue-800 leading-tight tabular-nums">
                    {formatTime(currentTime)}
                  </span>
                </div>
              ) : (
                "Focus Timer"
              )}
              {isTimerRunning && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              )}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Lesson Content */}
          <Card className="border-2 border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold text-slate-800">
                  The Water Cycle 💧
                </CardTitle>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAudioPlay}
                  loading={isLoading}
                  className="h-12 w-12 rounded-full hover:bg-blue-50 focus:ring-4 focus:ring-blue-300 bg-transparent"
                  aria-label="Listen to lesson content"
                >
                  <Volume2
                    className={`h-6 w-6 ${
                      isAudioPlaying ? "text-blue-600" : "text-slate-600"
                    }`}
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl leading-relaxed text-slate-700">
                  The water cycle shows how water moves through our planet.
                </p>

                <p className="text-xl leading-relaxed text-slate-700">
                  First, the sun heats up water in rivers, lakes, and oceans.
                  This water becomes vapor and rises into the air — this is
                  called <strong className="text-blue-600">evaporation</strong>.
                </p>

                <p className="text-xl leading-relaxed text-slate-700">
                  The water vapor cools down and turns into tiny drops to form
                  clouds — this is called{" "}
                  <strong className="text-purple-600">condensation</strong>.
                </p>

                <p className="text-xl leading-relaxed text-slate-700">
                  When the clouds get heavy, the water falls back to the ground
                  as rain — this is called{" "}
                  <strong className="text-green-600">precipitation</strong>.
                </p>

                <p className="text-xl leading-relaxed text-slate-700">
                  Water then flows back into rivers, lakes, and oceans — and the
                  cycle starts again!
                </p>
              </div>

              {renderAdaptiveContent()}

              {/* Help Me Button */}
              <div className="flex justify-start pt-4">
                <Button
                  onClick={handleHelpMe}
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 focus:ring-4 focus:ring-amber-300"
                  disabled={showAdaptiveContent}
                >
                  <HelpCircle className="h-5 w-5 mr-2" />
                  {showAdaptiveContent ? "Help Added!" : "Help Me"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Multiple Choice Question */}
          <Card className="border-2 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Quick Check! 🤔
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-slate-100 rounded-lg">
                <p className="text-xl font-semibold text-slate-800 mb-6">
                  {currentQuestion.question}
                </p>

                <div className="space-y-4">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 text-left text-lg font-medium rounded-lg border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-300 ${
                        selectedAnswer === option.id
                          ? option.isCorrect
                            ? "bg-green-100 border-green-400 text-green-800"
                            : "bg-red-100 border-red-400 text-red-800"
                          : selectedAnswer === null
                          ? "bg-white border-slate-300 hover:bg-slate-50 hover:border-slate-400"
                          : "bg-slate-100 border-slate-200 text-slate-500"
                      }`}
                      aria-label={`Option ${option.id.toUpperCase()}: ${
                        option.text
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>
                          {option.id.toUpperCase()}. {option.text}
                        </span>
                        {selectedAnswer === option.id &&
                          (option.isCorrect ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-600" />
                          ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              {feedback && (
                <div
                  className={`p-4 rounded-lg border-2 ${
                    feedback === "correct"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {feedback === "correct" ? (
                      <>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-xl font-semibold text-green-800">
                            ✅ That's right!
                          </p>
                          <p className="text-green-700">
                            Great job! Evaporation is when water turns into
                            vapor.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-8 w-8 text-red-600" />
                        <div className="flex-1">
                          <p className="text-xl font-semibold text-red-800">
                            ❌ Oops! Try again.
                          </p>
                          <p className="text-red-700 mb-4">
                            Think about what happens when the sun heats water.
                          </p>
                          <Button
                            onClick={handleRetry}
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 focus:ring-4 focus:ring-blue-300"
                          >
                            Try Again 🔄
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Next Button */}
              {feedback === "correct" && (
                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg focus:ring-4 focus:ring-blue-300"
                  onClick={() => {
                    setSelectedAnswer(null);
                    setFeedback(null);

                    if (currentQuestionIndex + 1 < questions.length) {
                      setCurrentQuestionIndex((prev) => prev + 1);
                    } else {
                      router.push("/Endpage"); // redirect when finished
                    }
                  }}
                >
                  {currentQuestionIndex + 1 < questions.length
                    ? "Continue to Next Question →"
                    : "Finish"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Pomodoro Timer Popout */}
        {showTimerPopout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md border-2 border-slate-200 shadow-xl bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-xl font-bold text-slate-800">
                      Focus Timer
                    </CardTitle>
                  </div>
                  <Button
                    onClick={() => setShowTimerPopout(false)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-slate-100 focus:ring-4 focus:ring-blue-300"
                    aria-label="Close timer"
                  >
                    <XCircle className="h-5 w-5 text-slate-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center">
                  <Badge
                    variant={timerPhase === "focus" ? "default" : "secondary"}
                    className="text-sm px-3 py-1"
                  >
                    {timerPhase === "focus" ? "Focus Time" : "Break Time"}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Progress</span>
                    <span>
                      {Math.round(
                        ((pomodoroTime - currentTime) / pomodoroTime) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all duration-1000 ${
                        timerPhase === "focus" ? "bg-blue-500" : "bg-green-500"
                      }`}
                      style={{
                        width: `${
                          ((pomodoroTime - currentTime) / pomodoroTime) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Timer Display */}
                <div className="text-center">
                  <div className="text-5xl font-bold text-slate-800 tabular-nums mb-2">
                    {formatTime(currentTime)}
                  </div>
                  <div className="text-base text-slate-500">
                    {currentTime === 0
                      ? "Time's up! Great work! 🎉"
                      : "Keep going! You're doing great! 💪"}
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="flex gap-3">
                  <Button
                    onClick={isTimerRunning ? pauseTimer : startTimer}
                    disabled={currentTime === 0}
                    size="lg"
                    className={`flex-1 ${
                      isTimerRunning
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white focus:ring-4 focus:ring-blue-300 py-3`}
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause className="h-5 w-5 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Start
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={resetTimer}
                    size="lg"
                    variant="outline"
                    className="px-4 hover:bg-slate-50 focus:ring-4 focus:ring-blue-300 bg-transparent py-3"
                    aria-label="Reset timer"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Quick Settings:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[15, 25, 45].map((minutes) => (
                      <Button
                        key={minutes}
                        onClick={() => {
                          const newTime = minutes * 60;
                          setPomodoroTime(newTime);
                          setCurrentTime(newTime);
                          setIsTimerRunning(false);
                        }}
                        size="sm"
                        variant="outline"
                        className={`${
                          pomodoroTime === minutes * 60
                            ? "bg-blue-100 text-blue-700 border-blue-300"
                            : "text-slate-600 hover:bg-slate-50 border-slate-300"
                        } focus:ring-2 focus:ring-blue-300 py-2`}
                      >
                        {minutes} min
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setShowTimerPopout(false)}
                  variant="ghost"
                  size="lg"
                  className="w-full text-slate-600 hover:bg-slate-50 focus:ring-4 focus:ring-blue-300"
                >
                  Minimize Timer
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
