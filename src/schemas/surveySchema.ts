import { z } from "zod";

export const SurveySchema = z.object({
  question_1: z.enum([
    "Picture the list in my head or write it out using symbols/diagrams",
    "Say the list out loud or repeat it to myself",
    "Write the list down or read it repeatedly",
  ]),

  question_2: z.enum([
    "I see a diagram, chart, or visual representation",
    "Someone explains it to me out loud",
    "I read about it in a textbook or notes",
  ]),

  question_3: z.enum([
    "Look at the diagram or interface map",
    "Have someone talk me through the steps",
    "Read the manual or help documentation",
  ]),

  question_4: z.enum([
    "Slides with images, graphs, or videos",
    "Lectures and discussions",
    "Handouts, readings and written instructions",
  ]),

  question_5: z.enum([
    "Draw them a map",
    "Explain it to them verbally",
    "Write them step-by-step instructions",
  ]),

  question_6: z.enum([
    "Using mind maps, highlighters, or diagrams",
    "Joining a study group or listening to recordings",
    "Writing summaries and rereading notes",
  ]),
});
