import { HumeService } from "@/services";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const humeService = new HumeService();
    const { text, learnerType } = await request.json();

    if (!text || !learnerType) {
      return NextResponse.json(
        { error: "Text and learnerType are required" },
        { status: 400 }
      );
    }

    // Generate personalized speech
    const base64Audio = await humeService.generatePersonalizedSpeech(
      text,
      learnerType
    );

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(base64Audio, "base64");

    // Return audio as response
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("TTS API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
