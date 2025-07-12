import { VOICE_CONFIGS } from "@/configs";
import { LearnerType } from "@/types";
import { HumeClient } from "hume";

const VOICE_IDS = {
  visual: process.env.VISUAL_LEARNER_VOICE_ID,
  auditory: process.env.AUDITORY_VOICE_ID,
  reader: process.env.READER_VOICE_ID,
} as const;

export class HumeService {
  private client: HumeClient;

  constructor() {
    this.client = new HumeClient({
      apiKey: process.env.HUME_API_KEY!,
      secretKey: process.env.HUME_SECRET_KEY!,
    });
  }

  async generatePersonalizedSpeech(
    text: string,
    learnerType: LearnerType
  ): Promise<string> {
    const voiceId = VOICE_IDS[learnerType];
    const { description, speed } = VOICE_CONFIGS[learnerType];

    if (!voiceId) {
      throw new Error(
        `No voice ID configured for learner type: ${learnerType}`
      );
    }

    const enhancedText = this.enhanceTextForLearnerType(text, learnerType);

    try {
      const response = await this.client.tts.synthesizeJson({
        body: {
          utterances: [
            {
              text: enhancedText,
              description,
              voice: {
                id: voiceId,
              },
              speed,
            },
          ],
          numGenerations: 1,
        },
      });

      return response.generations[0].audio;
    } catch (error) {
      console.error("Hume AI TTS Error:", error);
      throw new Error("Failed to generate personalized speech");
    }
  }

  private enhanceTextForLearnerType(
    text: string,
    learnerType: LearnerType
  ): string {
    switch (learnerType) {
      case "visual":
        return `Now, let me explain this visually: ${text}`;
      case "auditory":
        return `Listen carefully as I explain: ${text}`;
      case "reader":
        return `Here's the precise explanation: ${text}`;
      default:
        return text;
    }
  }

  private includeVoiceNameInText(
    text: string,
    learnerType: LearnerType
  ): string {
    const voiceName = VOICE_CONFIGS[learnerType].name;

    return `Hi, I'm ${voiceName}. ${text}`;
  }

  getAvailableVoices(): Record<string, string> {
    return VOICE_IDS;
  }

  hasVoiceForLearnerType(learnerType: string): LearnerType | undefined {
    return learnerType in VOICE_IDS ? (learnerType as LearnerType) : undefined;
  }
}
