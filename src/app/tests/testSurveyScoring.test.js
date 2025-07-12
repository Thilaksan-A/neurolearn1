import { loadScoringMap, calculateScores, classifyLearningStyle } 
  from "../services/scoring.js";
import { LearningStyle } from "../constants/survey.js";

describe("Scoring Service", () => {
  const scoringMap = loadScoringMap("src/app/scoring_map.yaml");

  test("loadScoringMap returns a non-empty map", () => {
    expect(Object.keys(scoringMap).length).toBeGreaterThan(0);
  });

  test("calculateScores correctly aggregates scores", () => {
    const answers1 = {
      question_1: "Picture the list in my head or write it out using symbols/diagrams",
      question_2: "Someone explains it to me out loud",
      question_3: "Read the manual or help documentation",
      question_4: "Slides with images, graphs, or videos",
      question_5: "Draw them a map",
      question_6: "Writing summaries and rereading notes",
    };
    const totals1 = calculateScores(answers1, scoringMap);
    expect(totals1[LearningStyle.VISUAL]).toBe(3);
    expect(totals1[LearningStyle.AUDITORY]).toBe(1);
    expect(totals1[LearningStyle.READWRITE]).toBe(2);

    const answers2 = {
      question_1: "Say the list out loud or repeat it to myself",
      question_2: "Someone explains it to me out loud",
      question_3: "Read the manual or help documentation",
      question_4: "Handouts, readings and written instructions",
      question_5: "Draw them a map",
      question_6: "Using mind maps, highlighters, or diagrams",
    }

    const totals2 = calculateScores(answers2, scoringMap);
    expect(totals2[LearningStyle.VISUAL]).toBe(2);
    expect(totals2[LearningStyle.AUDITORY]).toBe(2);
    expect(totals2[LearningStyle.READWRITE]).toBe(2);

  });

  test("classifyLearningStyle picks the correct style", () => {
    const scores1 = {
      [LearningStyle.VISUAL]: 3,
      [LearningStyle.AUDITORY]: 1,
      [LearningStyle.READWRITE]: 2,
    };
    expect(classifyLearningStyle(scores1)).toBe(LearningStyle.VISUAL);
  });

  const scores2 = {
    [LearningStyle.VISUAL]: 1,
    [LearningStyle.AUDITORY]: 4,
    [LearningStyle.READWRITE]: 1,
  }
  expect(classifyLearningStyle(scores2)).toBe(LearningStyle.AUDITORY)

  const scores3 = {
    [LearningStyle.VISUAL]: 0,
    [LearningStyle.AUDITORY]: 0,
    [LearningStyle.READWRITE]: 6,
  }
  expect(classifyLearningStyle(scores3)).toBe(LearningStyle.READWRITE)
});

