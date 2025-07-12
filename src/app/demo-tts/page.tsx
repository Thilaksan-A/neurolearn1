"use client";

import { useTTS } from "@/hooks";
import { LearnerType } from "@/types";
import { useState } from "react";

interface QuizQuestionProps {
  question: string;
  options: string[];
  learnerType: LearnerType;
  onAnswer: (answer: string) => void;
}

const QuizQuestion = ({
  question,
  options,
  learnerType,
  onAnswer,
}: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { speak, isLoading, error } = useTTS();

  const handleSpeak = () => {
    speak(question, learnerType);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">{question}</h2>
          <button
            onClick={handleSpeak}
            disabled={isLoading}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "🔄" : "🔊"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedAnswer(option);
              onAnswer(option);
            }}
            className={`w-full p-4 text-left text-black rounded-lg border transition-colors ${
              selectedAnswer === option
                ? "bg-blue-100 border-blue-500"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function DemoPage() {
  const handleAnswer = (answer: string) => {
    console.log("User answered:", answer);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">TTS Demo</h1>
      <QuizQuestion
        question="What is the process by which plants convert sunlight into energy?"
        options={["Photosynthesis", "Respiration", "Transpiration", "Osmosis"]}
        learnerType="reader"
        onAnswer={handleAnswer}
      />
    </div>
  );
}
