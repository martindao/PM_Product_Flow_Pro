import { productManager } from './productManager';
import { uxDesigner } from './uxDesigner';
import { softwareArchitect } from './softwareArchitect';

// Define workflow stages
export const EXPERT_WORKFLOW_STAGES = {
  PRODUCT_DEFINITION: 'product_definition',
  UX_DESIGN: 'ux_design',
  TECHNICAL_PLANNING: 'technical_planning'
};

// Map stages to experts
export const EXPERT_STAGE_MAPPING = {
  [EXPERT_WORKFLOW_STAGES.PRODUCT_DEFINITION]: 'productManager',
  [EXPERT_WORKFLOW_STAGES.UX_DESIGN]: 'uxDesigner',
  [EXPERT_WORKFLOW_STAGES.TECHNICAL_PLANNING]: 'softwareArchitect'
};

// Define completion criteria for each stage
export const STAGE_COMPLETION_CRITERIA = {
  [EXPERT_WORKFLOW_STAGES.PRODUCT_DEFINITION]: [
    'product_vision', 'user_personas', 'business_requirements',
    'feature_map', 'success_criteria'
  ],
  [EXPERT_WORKFLOW_STAGES.UX_DESIGN]: [
    'ui_documentation', 'feature_specifications', 'user_journeys',
    'interaction_patterns', 'data_requirements'
  ],
  [EXPERT_WORKFLOW_STAGES.TECHNICAL_PLANNING]: [
    'technical_architecture', 'api_specifications', 'implementation_tasks',
    'database_schema', 'testing_strategy'
  ]
};

// Stage introduction messages
export const STAGE_INTRODUCTIONS = {
  [EXPERT_WORKFLOW_STAGES.PRODUCT_DEFINITION]:
    "Let's start by defining your product with the AI Product Manager. We'll cover product vision, user personas, business requirements, feature mapping, and success criteria.",

  [EXPERT_WORKFLOW_STAGES.UX_DESIGN]:
    "Now let's design the user experience with the AI UX Designer. We'll work on UI documentation, feature specifications, user journeys, interaction patterns, and data requirements.",

  [EXPERT_WORKFLOW_STAGES.TECHNICAL_PLANNING]:
    "Finally, let's plan the technical implementation with the AI Software Architect. We'll define the technical architecture, API specifications, implementation tasks, database schema, and testing strategy."
};

// Export experts object
export const experts: { [key: string]: any } = {
  productManager,
  uxDesigner,
  softwareArchitect
};

// Helper function to get stage introduction
export function getStageIntroduction(stage: string): string {
  return STAGE_INTRODUCTIONS[stage] ||
    "Let's continue with the next phase of the expert workflow.";
}

// Helper function to get topic phrases for detection
export function getTopicPhrases(topic: string): string[] {
  const topicPhraseMap: {[key: string]: string[]} = {
    // Product Manager topics
    'product_vision': ['product vision', 'product concept', 'overall vision', 'product overview'],
    'user_personas': ['user personas', 'target audience', 'user profiles', 'customer segments'],
    'business_requirements': ['business requirements', 'business goals', 'requirements', 'constraints'],
    'feature_map': ['feature map', 'feature list', 'core features', 'functionality'],
    'success_criteria': ['success criteria', 'KPIs', 'metrics', 'success measures'],

    // UX Designer topics
    'ui_documentation': ['UI documentation', 'design system', 'visual design', 'UI components'],
    'feature_specifications': ['feature specifications', 'detailed features', 'feature details'],
    'user_journeys': ['user journeys', 'user flows', 'customer journey', 'user path'],
    'interaction_patterns': ['interaction patterns', 'interactions', 'user interactions'],
    'data_requirements': ['data requirements', 'data needs', 'information architecture'],

    // Software Architect topics
    'technical_architecture': ['technical architecture', 'system architecture', 'architecture'],
    'api_specifications': ['API specifications', 'API design', 'endpoints', 'services'],
    'implementation_tasks': ['implementation tasks', 'development tasks', 'coding tasks'],
    'database_schema': ['database schema', 'data model', 'database design'],
    'testing_strategy': ['testing strategy', 'test plan', 'quality assurance']
  };

  return topicPhraseMap[topic] || [topic.replace('_', ' ')];
}