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