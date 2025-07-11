import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { LearningStyle, SurveyQuestion } from "../constants/survey";

/**
 * 
 * @param {*} customPath 
 * @returns 
 */
export function loadScoringMap(customPath) {
    const yamlPath = customPath
    ? path.resolve(process.cwd(), customPath)
    : path.resolve(process.cwd(), "src", "app", "scoring_map.yaml");

  if (!fs.existsSync(yamlPath)) {
    throw new Error(`Scoring map not found at ${yamlPath}`);
  }

  const raw = fs.readFileSync(yamlPath, "utf8");
  const config = yaml.load(raw);
  const scoringMap = {};

  for (const [questionKey, options] of Object.entries(config)) {
    if (!Object.values(SurveyQuestion).includes(questionKey)) {
      throw new Error(`Unknown survey question: ${questionKey}`);
    }

    const answerMap = {};
    for (const [answerText, scoreObj] of Object.entries(options)) {
      const scoreOption = {};
      for (const [LearningStyleKey, pts] of Object.entries(scoreObj)) {
        if (!Object.values(LearningStyle).includes(LearningStyleKey)) {
          throw new Error(`Unknown score type: ${LearningStyleKey}`);
        }
        scoreOption[LearningStyleKey] = Number(pts);
      }
      answerMap[answerText] = scoreOption;
    }

    scoringMap[questionKey] = answerMap;
  }

  return scoringMap;
}

export function calculateScores(answers, scoringMap) {
    const totals = {};
    Object.values(LearningStyle).forEach((ls) => { totals[ls] = 0; });

    Object.values(SurveyQuestion).forEach((questionKey) => {
        const answer = answers[questionKey] || "";
        const optionMap = scoringMap[questionKey] || {};
        const scoreOption = optionMap[answer] || {};
        for (const [LearningStyleKey, pts] of Object.entries(scoreOption)) {
          totals[LearningStyleKey] += pts;
        }
      });
    
      return totals;
}

/**
 * Handles enum based learner profiling
 * @param {*} scores 
 * @returns 
 */
export function classifyLearningStyle(scores) {
    const vs = scores[LearningStyle.VISUAL];
    const aus = scores[LearningStyle.AUDITORY];
    const rs = scores[LearningStyle.READWRITE];

    if (vs >= aus && vs >= rs) {
        return LearningStyle.VISUAL
    }

    if (aus >= vs && aus >= rs) {
        return LearningStyle.AUDITORY
    }

    if (rs >= vs && rs >= aus) {
        return LearningStyle.READWRITE
    }

    return LearningStyle.READWRITE
}