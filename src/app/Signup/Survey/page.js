"use client";

import { Button } from "@/components/ui/button";
import Questions from "@/data/Questions";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Survey() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const question = Questions[stepIndex];
  const router = useRouter();
  if (!question) return null;

  const handleSelect = (option) => {
    setSelected(option);
    setAnswers(prev => ({
      ...prev,
      [`question_${question.id}`]: option
    }));
    setTimeout(handleNext, 300);
  };

  const handleNext = () => {
    if (stepIndex < Questions.length - 1) {
      setStepIndex(stepIndex + 1);
      setSelected(null);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      setSelected(null);
    }
  };

  const onComplete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/survey/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      router.push("/Homepage");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <div className="bg-[#D9D9D980] p-10 rounded-2xl shadow w-90 text-center max-w-md">
        <p className="text-lg font-semibold mb-4">{question.question}</p>

        <div className="space-y-2">
          {question.options.map((option, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(option)}
              className={`
                  cursor-pointer px-4 py-3 rounded-lg border border-[#32a220]
                  ${
                    selected === option
                      ? "bg-[#3eb12c85] text-white"
                      : "bg-white text-black"
                  }
                  hover:bg-blue-100
                `}
            >
              {option}
            </div>
          ))}
        </div>

        <Button
          onClick={handlePrevious}
          className="mt-6 bg-[#32a220] text-white px-4 py-2 rounded"
          disabled={stepIndex === 0}
        >
          Previous
        </Button>
      </div>
    </div>
  );
}

export default Survey;
