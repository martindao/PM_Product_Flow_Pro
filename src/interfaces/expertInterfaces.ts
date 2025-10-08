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

# [2025-04-15] (Expert) schedule note: Improve Task Master export for Expert

# [2025-06-02] (OpenRouter) schedule note: Harden OpenRouter integration for OpenRouter

# [2025-07-11] (Workflow) schedule note: Harden OpenRouter integration for Workflow

# [2025-08-21] (OpenRouter) schedule note: Refine MCP prompt flow for OpenRouter

# [2025-10-08] (Workflow) schedule note: Refine MCP prompt flow for Workflow
