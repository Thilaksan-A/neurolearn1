import { SurveySchema } from "@/schemas";
import {
  calculateScores,
  classifyLearningType,
  loadScoringMap,
} from "@/services/scoring";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  const auth = request.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  let userId: string;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    userId = payload.userId;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = SurveySchema.safeParse(body);
  if (!parsed.success) {
    console.error("Validation error:", parsed.error);
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error },
      { status: 400 }
    );
  }
  const answers = parsed.data;
  const answersString = JSON.stringify(answers);

  const scoringMap = loadScoringMap("src/data/scoring_map.yaml");
  const scores = calculateScores(answers, scoringMap);
  const learnerType = classifyLearningType(scores);

  const record = await prisma.survey.create({
    data: {
      user_id: userId,
      answers: answersString,
      visual_score: scores.visual,
      auditory_score: scores.auditory,
      reader_score: scores.reader,
      learner_type: learnerType,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      learner_type: learnerType,
    },
  });

  return NextResponse.json({ survey: record }, { status: 201 });
}
