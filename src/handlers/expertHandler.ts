import {
  EXPERT_WORKFLOW_STAGES,
  EXPERT_STAGE_MAPPING,
  STAGE_COMPLETION_CRITERIA,
  getStageIntroduction,
  getTopicPhrases,
  experts
} from '../experts';
import { WorkflowState } from '../state';
import { ExpertInteractionResult, TopicProgress } from '../interfaces/expertInterfaces';
import { consultWithExpert } from '../utils/aiUtils';

/**
 * Handle expert interaction based on the current workflow state
 */
export async function handleExpertInteraction(
  message: string,
  state: WorkflowState
): Promise<ExpertInteractionResult> {
  const { currentStage } = state;
  const expertName = EXPERT_STAGE_MAPPING[currentStage];

  // Get the current stage data or initialize it
  let stageData = state.stageData[currentStage] || {
    completed: false,
    completedTopics: []
  };

  // Check for stage transition requests
  if (shouldTransitionToNextStage(message, stageData)) {
    if (isStageComplete(currentStage, stageData)) {
      return transitionToNextStage(state);
    } else {
      return {
        response: `I notice we haven't completed all necessary topics for this stage. We still need to cover: ${getRemainingTopics(currentStage, stageData)}.`,
        updatedState: state
      };
    }
  }

  // Check for document generation requests
  if (shouldGenerateDocument(message)) {
    if (isStageComplete(currentStage, stageData)) {
      return generateDocument(state);
    } else {
      return {
        response: `Before generating the document, we should complete all topics. We still need to cover: ${getRemainingTopics(currentStage, stageData)}.`,
        updatedState: state
      };
    }
  }

  // Handle the current expert interaction
  const expert = experts[expertName];
  const expertPrompt = expert.systemPrompt;
  const contextData = getContextForStage(state);

  // Call the AI with appropriate prompt and context
  // Add context to the message if available
  const messageWithContext = contextData ? `${contextData}\n\n${message}` : message;
  const aiResponse = await consultWithExpert(expertName, messageWithContext);

  // Update the state with progress
  const updatedStageData = updateStageProgress(currentStage, stageData, message, aiResponse);

  const updatedState = {
    ...state,
    stageData: {
      ...state.stageData,
      [currentStage]: updatedStageData
    }
  };

  // Check if we should use the updated response (with document generation suggestion)
  const responseToUse = updatedStageData.suggestDocument ?
    aiResponse + "\n\nWe've covered all the necessary topics for this stage. Would you like me to generate the document now? Please confirm by saying 'Yes, generate the document'." :
    aiResponse;

  return {
    response: responseToUse,
    updatedState
  };
}

/**
 * Check if the user wants to move to the next stage
 */
function shouldTransitionToNextStage(message: string, stageData: any): boolean {
  const transitionPhrases = [
    "move to next stage",
    "continue to next stage",
    "proceed to next stage",
    "go to next stage",
    "move on to next phase",
    "continue to next phase",
    "let's move on",
    "let's continue to"
  ];

  return transitionPhrases.some(phrase =>
    message.toLowerCase().includes(phrase.toLowerCase())
  );
}

/**
 * Check if the user wants to generate a document
 */
function shouldGenerateDocument(message: string): boolean {
  const documentPhrases = [
    "generate document",
    "create document",
    "generate the document",
    "create the document",
    "generate the final document",
    "create the final document",
    "generate prd",
    "create prd",
    "generate specification",
    "create specification",
    "yes, generate the document",
    "yes, create the document",
    "please generate the document",
    "please create the document",
    "i'm ready for the document",
    "i am ready for the document",
    "let's generate the document",
    "let's create the document",
    "ok generate document",
    "ok create document",
    "ok generate the document",
    "ok create the document"
  ];

  return documentPhrases.some(phrase =>
    message.toLowerCase().includes(phrase.toLowerCase())
  );
}

/**
 * Check if all required topics for a stage are completed
 */
function isStageComplete(stage: string, stageData: any): boolean {
  const { completedTopics, completed } = stageData;
  const requiredTopics = STAGE_COMPLETION_CRITERIA[stage];

  // If already marked complete or all topics covered
  return completed ||
    (requiredTopics && requiredTopics.every(topic => completedTopics.includes(topic)));
}

/**
 * Get a list of remaining topics for a stage
 */
function getRemainingTopics(stage: string, stageData: any): string {
  const { completedTopics } = stageData;
  const requiredTopics = STAGE_COMPLETION_CRITERIA[stage];

  if (!requiredTopics) return "all topics";

  return requiredTopics
    .filter(topic => !completedTopics.includes(topic))
    .map(topic => topic.replace('_', ' '))
    .join(', ');
}

/**
 * Transition to the next stage in the workflow
 */
function transitionToNextStage(state: WorkflowState): ExpertInteractionResult {
  const currentIndex = Object.values(EXPERT_WORKFLOW_STAGES)
    .findIndex(stage => stage === state.currentStage);

  const stages = Object.values(EXPERT_WORKFLOW_STAGES);

  // If we're at the last stage
  if (currentIndex === stages.length - 1) {
    return {
      response: "Congratulations! We've completed all stages of the expert workflow. Would you like to generate the final comprehensive document that includes all three phases?",
      updatedState: {
        ...state,
        stageData: {
          ...state.stageData,
          [state.currentStage]: {
            ...state.stageData[state.currentStage],
            completed: true
          }
        }
      }
    };
  }

  // Move to next stage
  const nextStage = stages[currentIndex + 1];

  return {
    response: `Great! We've completed the ${state.currentStage.replace('_', ' ')} stage. Let's move on to the ${nextStage.replace('_', ' ')} stage.\n\n${getStageIntroduction(nextStage)}`,
    updatedState: {
      ...state,
      currentStage: nextStage,
      completedStages: [...state.completedStages, state.currentStage],
      stageData: {
        ...state.stageData,
        [state.currentStage]: {
          ...state.stageData[state.currentStage],
          completed: true
        },
        [nextStage]: {
          completed: false,
          completedTopics: []
        }
      }
    }
  };
}

/**
 * Generate a document based on the current stage
 */
function generateDocument(state: WorkflowState): ExpertInteractionResult {
  const { currentStage } = state;
  const expertName = EXPERT_STAGE_MAPPING[currentStage];
  const expert = experts[expertName];

  // Check if we have a document already or need to generate one
  if (!state.stageData[currentStage].document) {
    // We don't have a document yet, so ask for confirmation first
    return {
      response: `I'm ready to generate the ${expert.outputFormat} for your project. All required topics have been covered. Would you like me to generate the document now? Please confirm by saying "Yes, generate the document" or similar.`,
      updatedState: state
    };
  }

  // Get the document content from the stage data
  const document = state.stageData[currentStage].document;

  return {
    response: `Here's the ${expert.outputFormat} for your project:\n\n${document}`,
    updatedState: state,
    document,
    isComplete: true
  };
}

/**
 * Get context data for the current stage
 */
function getContextForStage(state: WorkflowState): string {
  let context = "";

  // Add context from previous stages
  for (const stage of state.completedStages) {
    const stageData = state.stageData[stage];
    if (stageData && stageData.document) {
      context += `${stageData.document}\n\n`;
    }
  }

  // Add context from current stage progress
  const currentStageData = state.stageData[state.currentStage];
  if (currentStageData && currentStageData.completedTopics.length > 0) {
    context += `Current progress in ${state.currentStage.replace('_', ' ')} stage:\n`;
    context += `Completed topics: ${currentStageData.completedTopics.join(', ')}\n`;
    if (currentStageData.currentTopic) {
      context += `Current topic: ${currentStageData.currentTopic}\n`;
    }
  }

  return context;
}

/**
 * Update the progress of the current stage based on the interaction
 */
function updateStageProgress(
  stage: string,
  stageData: any,
  userMessage: string,
  aiResponse: string
): any {
  const { completedTopics, currentTopic } = stageData;
  const requiredTopics = STAGE_COMPLETION_CRITERIA[stage];

  // Detect if we've completed the current topic based on AI response
  const topicCompletion = detectTopicCompletion(aiResponse, currentTopic);

  // Detect next topic if current one is complete
  const nextTopic = topicCompletion
    ? detectNextTopic(requiredTopics, completedTopics, userMessage, aiResponse)
    : currentTopic;

  // Update completed topics if we finished one
  const updatedCompletedTopics = topicCompletion && currentTopic
    ? [...completedTopics, currentTopic]
    : completedTopics;

  // Check if all topics are completed but don't automatically generate a document
  const allTopicsCompleted = requiredTopics.every(topic => updatedCompletedTopics.includes(topic));

  // Only mark as document generated if the AI response actually contains a document format
  // AND we've explicitly been asked to generate a document (handled elsewhere)
  const documentGenerated = false;

  // Check if all topics are completed to suggest document generation

  return {
    ...stageData,
    completedTopics: updatedCompletedTopics,
    currentTopic: nextTopic,
    document: documentGenerated ? aiResponse : stageData.document,
    completed: documentGenerated,
    suggestDocument: allTopicsCompleted && !stageData.document
  };
}

/**
 * Detect if a topic has been completed based on the AI response
 */
function detectTopicCompletion(aiResponse: string, currentTopic?: string): boolean {
  if (!currentTopic) return false;

  // Check for phrases that indicate topic completion
  const completionPhrases = [
    "Great, we've covered",
    "Now that we've discussed",
    "Let's move on to",
    "Next, let's talk about",
    "We've completed",
    "We've finished discussing",
    "That covers",
    "Now we can move to"
  ];

  return completionPhrases.some(phrase => aiResponse.includes(phrase));
}

/**
 * Detect the next topic to discuss based on the interaction
 */
function detectNextTopic(
  requiredTopics: string[],
  completedTopics: string[],
  userMessage: string,
  aiResponse: string
): string | undefined {
  // Find topics not yet completed
  const remainingTopics = requiredTopics.filter(
    topic => !completedTopics.includes(topic)
  );

  if (remainingTopics.length === 0) return undefined;

  // Detect which topic is being introduced
  for (const topic of remainingTopics) {
    const topicPhrases = getTopicPhrases(topic);
    for (const phrase of topicPhrases) {
      if (aiResponse.toLowerCase().includes(`let's discuss ${phrase}`) ||
          aiResponse.toLowerCase().includes(`let's talk about ${phrase}`) ||
          aiResponse.toLowerCase().includes(`now, let's focus on ${phrase}`) ||
          aiResponse.toLowerCase().includes(`next, we'll cover ${phrase}`)) {
        return topic;
      }
    }
  }

  // Default to first remaining topic if we can't detect
  return remainingTopics[0];
}

/**
 * Prepare a comprehensive document for Task Master
 */
export function prepareDocumentForTaskMaster(state: WorkflowState): string {
  const { stageData } = state;

  const productDoc = stageData[EXPERT_WORKFLOW_STAGES.PRODUCT_DEFINITION]?.document || '';
  const uxDoc = stageData[EXPERT_WORKFLOW_STAGES.UX_DESIGN]?.document || '';
  const techDoc = stageData[EXPERT_WORKFLOW_STAGES.TECHNICAL_PLANNING]?.document || '';

  // Combine all documents with separators
  const combinedDoc = `
# COMPREHENSIVE PROJECT SPECIFICATION

${productDoc}

---

${uxDoc}

---

${techDoc}
`;

  return combinedDoc;
}
