import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const stylePrompts = {
  visual:
    // "Reformat this lesson to help a visual learner. Use vivid imagery, spatial language, or suggest simple diagrams.",
    // `
    //   You're teaching a student who is a visual learner.
    //   Transform the following lesson using vivid imagery, spatial language, and descriptive language.
    //   Where helpful, suggest visuals, diagrams, or comparisons to help them picture the ideas in their mind.
    //   Speak directly to the student as if you're guiding them through the topic visually.
    // `,
    `You are teaching a student who is a visual learner.
    Transform the following lesson using vivid imagery, spatial language, and descriptive language.
    Speak directly to the student as if you're guiding them visually through the topic.
    Where helpful, include suggestions for visuals, diagrams, or comparisons that help the student picture the ideas.
    Output ONLY valid JSON: an array of objects, each with two keys:
    - "text": the narration text for that step
    - "visual": a brief description of a suggested visual or diagram (or null if none)
    Example output:
    [
      {
        "text": "Imagine our planet Earth as a giant, swirling blue marble.",
        "visual": "Show a globe with oceans clearly marked in bright blue."
      },
      {
        "text": "Now picture the sun shining down on the water.",
        "visual": "Diagram of sun rays warming a body of water."
      }
    ]

    Here is the lesson to transform:`,

  auditory: `
    Rewrite the following lesson for an auditory learner 
    as if it were being read aloud in an engaging and emotional voice. 
    Use expressive, rhythmic language, vivid sound words (like whoosh, plop, rumble),
    and strong pacing — but do NOT include stage directions, tone instructions, or narrator notes. 
    The story should naturally sound dramatic, playful, or mysterious based on the words and rhythm alone.
  `,

  kinesthetic: `
  You're helping a student who learns by doing and moving.
  Transform the lesson to include hands-on examples, physical activities, and real-world actions they can imagine or perform.
  Use language that connects the concept to movement or manipulation.
  Talk directly to the student and make the lesson feel interactive.
  `,
  reader:
    // "Make this lesson clearer for a text-preferring learner. Use structured bullet points and clear logic.",
    //   `
    //   You're teaching a student who prefers clear text and logical structure.
    //   Reformat the lesson with bullet points, headings, numbered steps, or ordered lists where appropriate.
    //   Keep it precise and easy to follow.
    //   Talk to the student with clarity, as if you're walking them step-by-step through the idea.
    // `,
    `
    You're teaching a student who prefers clear text and logical structure.
    Rewrite the lesson using numbered steps or bullet points in markdown format.
    Make it easy to follow and scan quickly.
    Use concise sentences.
    Output ONLY the restructured lesson as markdown with bullet points or numbered lists — no extra explanation.
   `,
};

export async function POST(request) {
  const { lesson, learningStyle } = await request.json();

  if (!lesson || !learningStyle || !stylePrompts[learningStyle]) {
    return NextResponse.json(
      { error: "Missing or invalid input" },
      { status: 400 }
    );
  }

  const fullPrompt = `${stylePrompts[learningStyle]}\n\nLesson:\n${lesson}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    let text = response.text ?? "No output generated";
    if (learningStyle == "auditory") {
      text = text.replace(/\n\n+/g, " ");
    }
    if (learningStyle == "visual") {
      text = raw.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        console.error("Failed to parse AI JSON:", e);
        return NextResponse.json(
          { error: "Failed to parse AI JSON response" },
          { status: 500 }
        );
      }
    }
    return NextResponse.json({ transformed: text });
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json(
      { error: "Gemini API call failed" },
      { status: 500 }
    );
  }
}
