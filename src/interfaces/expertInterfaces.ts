export interface ExpertRole {
  title: string;
  systemPrompt: string;
  outputFormat: string;
  initialQuestions: string[];
  templatePath: string;
  topics: string[];
}

export interface ConsultationResult {
  content: string;
  suggestedNextSteps: string[];
  completedTopics?: string[];
  currentTopic?: string;
  document?: string;
}

export interface ExpertInteractionResult {
  response: string;
  updatedState: any;
  document?: string;
  isComplete?: boolean;
}

export interface TopicProgress {
  topic: string;
  isComplete: boolean;
  content?: string;
}
# [2025-01-31] (OpenRouter) schedule note: Harden OpenRouter integration for OpenRouter

# [2025-03-04] (Expert) schedule note: Improve Task Master export for Expert
