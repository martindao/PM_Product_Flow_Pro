// Workflow state management for AI Expert Workflow

import { EXPERT_WORKFLOW_STAGES, STAGE_COMPLETION_CRITERIA } from '../experts';

export interface WorkflowState {
  currentStage: string;
  completedStages: string[];
  stageData: {
    [key: string]: {
      completed: boolean;
      document?: string;
      completedTopics: string[];
      currentTopic?: string;
    }
  };
}

// Initialize with default state
export const initialState: WorkflowState = {
  currentStage: EXPERT_WORKFLOW_STAGES.PRODUCT_DEFINITION,
  completedStages: [],
  stageData: {
    [EXPERT_WORKFLOW_STAGES.PRODUCT_DEFINITION]: {
      completed: false,
      completedTopics: [],
    }
  }
};

// Calculate overall progress percentage
export function calculateProgress(state: WorkflowState): number {
  const totalStages = Object.keys(EXPERT_WORKFLOW_STAGES).length;
  const completedStages = state.completedStages.length;
  
  // If current stage is in progress, calculate its progress
  let currentStageProgress = 0;
  if (state.stageData[state.currentStage]) {
    const stageData = state.stageData[state.currentStage];
    const requiredTopics = STAGE_COMPLETION_CRITERIA[state.currentStage];
    
    if (requiredTopics && requiredTopics.length > 0) {
      currentStageProgress = stageData.completedTopics.length / requiredTopics.length;
    }
  }
  
  // Overall progress: completed stages + progress of current stage
  return Math.min(100, Math.round(((completedStages + currentStageProgress) / totalStages) * 100));
}
