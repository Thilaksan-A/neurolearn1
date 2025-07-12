"use client";

import { Button } from "@/components/ui/button";
import { QUESTIONS } from "@/data";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function Survey() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const question = QUESTIONS[stepIndex];
  const router = useRouter();

  if (!question) return null;

  const handleSelect = (option: string) => {
    setSelected(option);

    const updatedAnswers = {
      ...answers,
      [`question_${question.id}`]: option,
    };
    setAnswers(updatedAnswers);

    setTimeout(() => {
      if (stepIndex < QUESTIONS.length - 1) {
        setStepIndex(stepIndex + 1);
        setSelected(null);
      } else {
        // On the last question, call onComplete with the updated answers
        onComplete(updatedAnswers);
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      setSelected(null);
    }
  };

  const onComplete = async (finalAnswers = answers) => {
    setIsSubmitting(true);
    console.log("Submitting answers:", finalAnswers);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No authentication token found. Please login again.");
        router.push("/Login");
        return;
      }

      const res = await axios.post("/api/survey", finalAnswers, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Survey submitted successfully! Welcome to NeuroLearn!");
        console.log("Survey submitted successfully:", res.data);
        router.push("/Homepage");
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      console.error("Survey submission error:", err);

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          toast.error("Authentication failed. Please login again.");
          localStorage.removeItem("token");
          router.push("/Login");
        } else {
          const errorMessage = err.response?.data?.error || err.message;
          toast.error(`Failed to submit survey: ${errorMessage}`);
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <div className="bg-[#D9D9D980] p-10 rounded-2xl shadow w-90 text-center max-w-md">
        {/* Progress indicator */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Question {stepIndex + 1} of {QUESTIONS.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-[#32a220] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((stepIndex + 1) / QUESTIONS.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <p className="text-lg font-semibold mb-4">{question.question}</p>

        <div className="space-y-2">
          {question.options.map((option, idx) => (
            <div
              key={idx}
              onClick={() => !isSubmitting && handleSelect(option)}
              className={`
                cursor-pointer px-4 py-3 rounded-lg border border-[#32a220] transition-all duration-200
                ${
                  selected === option
                    ? "bg-[#3eb12c85] text-white"
                    : "bg-white text-black"
                }
                ${
                  !isSubmitting
                    ? "hover:bg-blue-100"
                    : "cursor-not-allowed opacity-50"
                }
              `}
            >
              {option}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Button
            onClick={handlePrevious}
            className="bg-gray-500 hover:bg-gray-600 text-white"
            disabled={stepIndex === 0 || isSubmitting}
            variant="default"
            size="default"
          >
            Previous
          </Button>
        </div>

        {/* Show completion status on last question */}
        {stepIndex === QUESTIONS.length - 1 && isSubmitting && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Submitting your survey...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Survey;
