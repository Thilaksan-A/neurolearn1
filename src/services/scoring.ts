import { LearnerType } from "@/types";
import fs from "fs";
import path from "path";
import yaml from "yaml";

interface ScoreOption {
  [key: string]: number;
}

interface AnswerMap {
  [answerText: string]: ScoreOption;
}

interface ScoringMap {
  [questionKey: string]: AnswerMap;
}

interface Scores {
  [key: string]: number;
}

interface SurveyAnswers {
  [questionKey: string]: string;
}

enum SurveyQuestion {
  QUESTION_1 = "question_1",
  QUESTION_2 = "question_2",
  QUESTION_3 = "question_3",
  QUESTION_4 = "question_4",
  QUESTION_5 = "question_5",
  QUESTION_6 = "question_6",
}

// Define learner types as constants for consistency
const LEARNER_TYPES = {
  VISUAL: "visual",
  AUDITORY: "auditory",
  READER: "reader",
} as const;

/**
 * Loads in scoring_map.yaml to get all scores for all survey questions
 * @param customPath - Optional custom path to scoring map
 * @returns scoringMap
 */
export function loadScoringMap(customPath?: string): ScoringMap {
  const yamlPath = customPath
    ? path.resolve(process.cwd(), customPath)
    : path.resolve(process.cwd(), "src", "app", "scoring_map.yaml");

  if (!fs.existsSync(yamlPath)) {
    throw new Error(`Scoring map not found at ${yamlPath}`);
  }

  const raw = fs.readFileSync(yamlPath, "utf8");
  const config = yaml.parse(raw) as Record<string, any>;
  const scoringMap: ScoringMap = {};

  // Add null check for config
  if (!config || typeof config !== "object") {
    throw new Error("Invalid scoring map format");
  }

  for (const [questionKey, options] of Object.entries(config)) {
    // Check if it's a valid survey question
    if (
      !Object.values(SurveyQuestion).includes(questionKey as SurveyQuestion)
    ) {
      throw new Error(`Unknown survey question: ${questionKey}`);
    }

    const answerMap: AnswerMap = {};

    // Add null check for options
    if (!options || typeof options !== "object") {
      throw new Error(`Invalid options for question: ${questionKey}`);
    }

    for (const [answerText, scoreObj] of Object.entries(options)) {
      const scoreOption: ScoreOption = {};

      // Add null check for scoreObj
      if (!scoreObj || typeof scoreObj !== "object") {
        throw new Error(`Invalid score object for answer: ${answerText}`);
      }

      for (const [learnerTypeKey, pts] of Object.entries(scoreObj)) {
        // Check if it's a valid learner type
        if (
          !Object.values(LEARNER_TYPES).includes(learnerTypeKey as LearnerType)
        ) {
          throw new Error(`Unknown learner type: ${learnerTypeKey}`);
        }

        // Add proper number conversion with validation
        const points = Number(pts);
        if (isNaN(points)) {
          throw new Error(`Invalid score value for ${learnerTypeKey}: ${pts}`);
        }

        scoreOption[learnerTypeKey] = points;
      }
      answerMap[answerText] = scoreOption;
    }

    scoringMap[questionKey] = answerMap;
  }

  return scoringMap;
}

/**
 * Aggregates scores based off user's survey answers
 * @param answers - User's survey answers
 * @param scoringMap - Scoring map from loadScoringMap
 * @returns Aggregated scores
 */
export function calculateScores(
  answers: SurveyAnswers,
  scoringMap: ScoringMap
): Scores {
  const totals: Scores = {};

  // Initialize all learner types to 0
  Object.values(LEARNER_TYPES).forEach((learnerType) => {
    totals[learnerType] = 0;
  });

  // Process each question
  Object.values(SurveyQuestion).forEach((questionKey) => {
    const answer = answers[questionKey] || "";
    const optionMap = scoringMap[questionKey] || {};
    const scoreOption = optionMap[answer] || {};

    // Add scores for each learner type
    for (const [learnerTypeKey, pts] of Object.entries(scoreOption)) {
      if (typeof pts === "number") {
        totals[learnerTypeKey] = (totals[learnerTypeKey] || 0) + pts;
      }
    }
  });

  return totals;
}

/**
 * Handles learner type classification
 * @param scores - Calculated scores from calculateScores
 * @returns Dominant learner type
 */
export function classifyLearningType(scores: Scores): LearnerType {
  // Add validation for scores object
  if (!scores || typeof scores !== "object") {
    throw new Error("Invalid scores object");
  }

  const visual = scores[LEARNER_TYPES.VISUAL] || 0;
  const auditory = scores[LEARNER_TYPES.AUDITORY] || 0;
  const reader = scores[LEARNER_TYPES.READER] || 0;

  // Find the highest score
  if (visual >= auditory && visual >= reader) {
    return LEARNER_TYPES.VISUAL;
  }

  if (auditory >= visual && auditory >= reader) {
    return LEARNER_TYPES.AUDITORY;
  }

  return LEARNER_TYPES.READER;
}

/**
 * Helper function to validate learner type
 * @param learnerType - LearnerType to validate
 * @returns boolean indicating if valid
 */
export function isValidLearnerType(
  learnerType: string
): learnerType is LearnerType {
  return Object.values(LEARNER_TYPES).includes(learnerType as LearnerType);
}

/**
 * Helper function to get all available learner types
 * @returns Array of all learner types
 */
export function getAllLearnerTypes(): LearnerType[] {
  return Object.values(LEARNER_TYPES);
}
