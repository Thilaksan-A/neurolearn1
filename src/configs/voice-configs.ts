import { LearnerType, LearnerTypeConfig } from "@/types";

export const VOICE_CONFIGS: Record<LearnerType, LearnerTypeConfig> = {
  visual: {
    name: "Tony",
    description:
      "Manly, deep, confident and sexy voice with clear articulation. Suitable for visual learners who benefit from expressive and engaging narration.",
    speed: 0.3,
  },
  auditory: {
    name: "Ethan",
    description:
      "Soft, calm, and soothing voice with a gentle tone. Ideal for auditory learners who prefer a relaxed and easy-to-follow speaking style.",
    speed: 0.8,
  },
  reader: {
    name: "T K",
    description:
      "British accent with precise pronunciation and a steady pace. Great for readers who appreciate clarity and a touch of sophistication.",
    speed: 1.3,
  },
};
