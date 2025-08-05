import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.VOICE_API_KEY || "AIzaSyAJOR6_MEg5JHkaQCZQ95mYTDgW8z6yhkM",
});

export interface VoiceIntent {
  intent: "navigation" | "job_search" | "job_action" | "grievance" | "unknown";
  action: string;
  parameters?: {
    jobType?: string;
    destination?: string;
    urgency?: "normal" | "urgent";
  };
  confidence: number;
}

export class VoiceIntentService {
  private static instance: VoiceIntentService;
  private model = ai.models;

  private constructor() {}

  static getInstance(): VoiceIntentService {
    if (!VoiceIntentService.instance) {
      VoiceIntentService.instance = new VoiceIntentService();
    }
    return VoiceIntentService.instance;
  }

  async analyzeIntent(voiceText: string): Promise<VoiceIntent> {
    try {
      const prompt = `
You are an AI assistant for a job platform app called FairPay, designed for blue-collar workers in India. 
Analyze the following voice command and determine the user's intent.

Voice Command: "${voiceText}"

Available intents and actions:
1. NAVIGATION:
   - navigate_profile: Go to profile page
   - navigate_jobs: Go to jobs listing page  
   - navigate_analytics: Go to analytics/dashboard page
   - navigate_grievance: Go to grievance/complaint page

2. JOB_SEARCH:
   - search_jobs: Search for jobs (extract job type if mentioned)
   - Available job types: electrician, plumber, construction, mechanic, welder, carpenter

3. JOB_ACTION:
   - apply_job: Apply for a job
   - save_job: Save/bookmark a job
   - view_job_details: View job details

4. GRIEVANCE:
   - file_grievance: File a complaint or grievance
   - view_grievances: Check grievance status

5. UNKNOWN: If the command doesn't match any category

Consider these patterns:
- Hindi/English mixed commands (e.g., "jobs dikhao", "profile kholo")
- Casual language (e.g., "show me", "I want", "find")
- Job types in Hindi (e.g., "bijli ka kaam" = electrician, "paip ka kaam" = plumber)

Respond with a JSON object:
{
  "intent": "category",
  "action": "specific_action", 
  "parameters": {
    "jobType": "extracted_job_type_if_any",
    "destination": "page_name_if_navigation",
    "urgency": "normal_or_urgent_if_grievance"
  },
  "confidence": 0.95
}`;

      const response = await this.model.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt,
      });

      const responseText = response.text?.trim() || "";

      if (!responseText) {
        throw new Error("Empty response from AI model");
      }

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid response format");
      }

      const intentData = JSON.parse(jsonMatch[0]) as any;

      // Normalize intent types from uppercase to lowercase
      const normalizedIntent = this.normalizeIntentType(intentData.intent);

      // Validate and set defaults
      return {
        intent: normalizedIntent,
        action: intentData.action || "unknown",
        parameters: {
          jobType: intentData.parameters?.jobType || undefined,
          destination: intentData.parameters?.destination || undefined,
          urgency: intentData.parameters?.urgency || "normal",
        },
        confidence: Math.min(Math.max(intentData.confidence || 0.5, 0), 1),
      };
    } catch (error) {
      console.error("Error analyzing voice intent:", error);

      // Fallback to simple keyword matching
      return this.fallbackIntentDetection(voiceText);
    }
  }

  private normalizeIntentType(
    intent: string
  ): "navigation" | "job_search" | "job_action" | "grievance" | "unknown" {
    const intentMap: Record<
      string,
      "navigation" | "job_search" | "job_action" | "grievance" | "unknown"
    > = {
      NAVIGATION: "navigation",
      JOB_SEARCH: "job_search",
      JOB_ACTION: "job_action",
      GRIEVANCE: "grievance",
      UNKNOWN: "unknown",
      // Also handle lowercase versions just in case
      navigation: "navigation",
      job_search: "job_search",
      job_action: "job_action",
      grievance: "grievance",
      unknown: "unknown",
    };

    return intentMap[intent] || "unknown";
  }

  private fallbackIntentDetection(text: string): VoiceIntent {
    const lowerText = text.toLowerCase();

    // Navigation patterns
    if (lowerText.includes("profile") || lowerText.includes("प्रोफाइल")) {
      return {
        intent: "navigation",
        action: "navigate_profile",
        parameters: { destination: "profile" },
        confidence: 0.8,
      };
    }

    if (
      lowerText.includes("job") ||
      lowerText.includes("काम") ||
      lowerText.includes("नौकरी")
    ) {
      return {
        intent: "navigation",
        action: "navigate_jobs",
        parameters: { destination: "jobs" },
        confidence: 0.8,
      };
    }

    if (
      lowerText.includes("analytics") ||
      lowerText.includes("dashboard") ||
      lowerText.includes("stats")
    ) {
      return {
        intent: "navigation",
        action: "navigate_analytics",
        parameters: { destination: "analytics" },
        confidence: 0.8,
      };
    }

    if (
      lowerText.includes("complaint") ||
      lowerText.includes("grievance") ||
      lowerText.includes("शिकायत")
    ) {
      return {
        intent: "navigation",
        action: "navigate_grievance",
        parameters: { destination: "grievance" },
        confidence: 0.8,
      };
    }

    // Job search patterns
    const jobTypes = [
      "electrician",
      "plumber",
      "construction",
      "mechanic",
      "welder",
      "carpenter",
    ];
    const hindiJobTypes = {
      बिजली: "electrician",
      पाइप: "plumber",
      निर्माण: "construction",
      मैकेनिक: "mechanic",
      वेल्डर: "welder",
      बढ़ई: "carpenter",
    };

    for (const jobType of jobTypes) {
      if (lowerText.includes(jobType)) {
        return {
          intent: "job_search",
          action: "search_jobs",
          parameters: { jobType },
          confidence: 0.7,
        };
      }
    }

    for (const [hindi, english] of Object.entries(hindiJobTypes)) {
      if (lowerText.includes(hindi)) {
        return {
          intent: "job_search",
          action: "search_jobs",
          parameters: { jobType: english },
          confidence: 0.7,
        };
      }
    }

    return {
      intent: "unknown",
      action: "unknown",
      parameters: {},
      confidence: 0.3,
    };
  }
}

export const voiceIntentService = VoiceIntentService.getInstance();
