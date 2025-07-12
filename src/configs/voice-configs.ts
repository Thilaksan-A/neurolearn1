import { LearnerType, LearnerTypeConfig } from "@/types";

export const VOICE_CONFIGS: Record<LearnerType, LearnerTypeConfig> = {
  visual: {
    name: "Tony",
    description: "Manly sexy voice.",
    speed: 0.3,
  },
  auditory: {
    name: "Ethan",
    description: "Soft voice.",
    speed: 0.8,
  },
  reader: {
    name: "T K",
    description: "British accent.",
    speed: 1.3,
  },
};
