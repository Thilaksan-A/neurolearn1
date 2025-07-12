import { LearnerType, LearnerTypeConfig } from "@/types";

export const VOICE_CONFIGS: Record<LearnerType, LearnerTypeConfig> = {
  visual: {
    name: "Tony",
    description:
      "Manly voice. A visual learner who benefits from diagrams and illustrations.",
    speed: 0.3,
  },
  auditory: {
    name: "Ethan",
    description:
      "Soft voice. An auditory learner who excels with spoken instructions and discussions.",
    speed: 0.8,
  },
  reader: {
    name: "T K",
    description:
      "British accent. A reading/writing learner who prefers written text and detailed explanations with strong grammar.",
    speed: 1.3,
  },
};
