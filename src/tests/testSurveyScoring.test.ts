import {
  calculateScores,
  classifyLearningType,
  loadScoringMap,
} from "@/services";

describe("Scoring Service", () => {
  const scoringMap = loadScoringMap("src/data/scoring_map.yaml");

  test("loadScoringMap returns a non-empty map", () => {
    expect(Object.keys(scoringMap).length).toBeGreaterThan(0);
  });

  test("calculateScores correctly aggregates scores", () => {
    const answers1 = {
      question_1:
        "Picture the list in my head or write it out using symbols/diagrams",
      question_2: "Someone explains it to me out loud",
      question_3: "Read the manual or help documentation",
      question_4: "Slides with images, graphs, or videos",
      question_5: "Draw them a map",
      question_6: "Writing summaries and rereading notes",
    };
    const totals1 = calculateScores(answers1, scoringMap);
    expect(totals1["visual"]).toBe(3);
    expect(totals1["auditory"]).toBe(1);
    expect(totals1["reader"]).toBe(2);

    const answers2 = {
      question_1: "Say the list out loud or repeat it to myself",
      question_2: "Someone explains it to me out loud",
      question_3: "Read the manual or help documentation",
      question_4: "Handouts, readings and written instructions",
      question_5: "Draw them a map",
      question_6: "Using mind maps, highlighters, or diagrams",
    };

    const totals2 = calculateScores(answers2, scoringMap);
    expect(totals2["visual"]).toBe(2);
    expect(totals2["auditory"]).toBe(2);
    expect(totals2["reader"]).toBe(2);
  });

  test("classifyLearningType picks the correct style", () => {
    const scores1 = {
      ["visual"]: 3,
      ["auditory"]: 1,
      ["reader"]: 2,
    };
    expect(classifyLearningType(scores1)).toBe("visual");
  });

  const scores2 = {
    ["visual"]: 1,
    ["auditory"]: 4,
    ["reader"]: 1,
  };
  expect(classifyLearningType(scores2)).toBe("auditory");

  const scores3 = {
    ["visual"]: 0,
    ["auditory"]: 0,
    ["reader"]: 6,
  };
  expect(classifyLearningType(scores3)).toBe("reader");
});
