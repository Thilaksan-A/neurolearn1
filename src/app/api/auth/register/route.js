import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import {
  calculateScores,
  classifyLearningStyle,
  loadScoringMap
} from "../../../services/scoring";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  const body = await request.json();
  const { name, email, password } = body;

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    JWT_SECRET
  );

  return NextResponse.json({ token }, { status: 201 });
}

export async function GET(request, { params }) {
  const userId = parseInt(params.id, 10);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, answers: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const scoringMap = loadScoringMap("src/app/scoring_map.yaml"); 
  const scores = calculateScores(user.answers, scoringMap);
  const learningStyle = classifyLearningStyle(scores);

  return NextResponse.json(
    {
      user: { id: user.id, name: user.name, email: user.email },
      scores,
      learningStyle,
    },
    { status: 200 }
  );
}
