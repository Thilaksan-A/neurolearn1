import prisma from "@/lib/prisma";
import { calculateScores, classifyLearningStyle, loadScoringMap } from "@/services/scoring";
import { SurveySchema } from "@/surveySchema";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  const auth = request.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  let userId;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    userId = payload.userId;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = SurveySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.format() },
      { status: 400 }
    );
  }
  const answers = parsed.data;

  const scoringMap = loadScoringMap("src/app/scoring_map.yaml");
  const scores = calculateScores(answers, scoringMap);
  const style = classifyLearningStyle(scores);

  const record = await prisma.survey.create({
    data: {
      userId,
      ...answers,
      visualScore: scores.visual,
      auditoryScore: scores.auditory,
      readerScore: scores.reader,
      style,
    },
  });

  return NextResponse.json({ survey: record }, { status: 201 });
}
