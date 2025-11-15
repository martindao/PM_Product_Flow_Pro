// Import the McpServer class using require instead of import
import { experts, EXPERT_WORKFLOW_STAGES, getStageIntroduction } from './experts';
import { consultWithExpert, generateExpertDocument, saveForTaskMaster } from './utils/aiUtils';
import { saveDocument, saveExpertDocument, readTemplate, setupTaskMasterIntegration } from './utils/fileUtils';
import { initialState, WorkflowState } from './state';
import { handleExpertInteraction, prepareDocumentForTaskMaster } from './handlers/expertHandler';
import fs from 'fs/promises';
import path from 'path';

// Define a global variable for TypeScript
declare global {
  var McpServer: any;
  var isDebugMode: boolean;
}

// Enable debug logging if DEBUG env variable is set
global.isDebugMode = process.env.DEBUG?.includes('mcp') || false;

function log(...args: any[]) {
  if (global.isDebugMode) {
    console.log('[AI-EXPERT-MCP]', ...args);
  }
}

function logError(...args: any[]) {
  console.error('[AI-EXPERT-MCP-ERROR]', ...args);
}

// Load the MCP SDK synchronously
let mcpServerLoaded = false;
try {
  const mcpModule = require('@modelcontextprotocol/sdk/server/mcp.js');
  global.McpServer = mcpModule.McpServer;
  mcpServerLoaded = true;
  log('MCP SDK loaded successfully');
} catch (error) {
  logError('Failed to load MCP SDK synchronously:', error);

  // Fallback to async loading
  import('@modelcontextprotocol/sdk/server/mcp.js').then(module => {
    global.McpServer = module.McpServer;
    mcpServerLoaded = true;
    log('MCP SDK loaded asynchronously');
  }).catch(error => {
    logError('Error importing MCP SDK asynchronously:', error);
    process.exit(1);
  });
}

// Retry mechanism for server creation
export async function waitForMcpSdk(maxRetries = 5, delayMs = 1000): Promise<boolean> {
  let retries = 0;

  while (!mcpServerLoaded && retries < maxRetries) {
    log(`Waiting for MCP SDK to load... (attempt ${retries + 1}/${maxRetries})`);
    await new Promise(resolve => setTimeout(resolve, delayMs));
    retries++;
  }

  return mcpServerLoaded;
}

export function createMCPServer() {
  // Check if MCP SDK is loaded
  if (!global.McpServer) {
    logError('MCP SDK not loaded yet. Please try again in a moment.');
    return null;
  }

  try {
    log('Creating MCP server instance');
    const server = new global.McpServer({
      name: 'ai-expert-workflow',
      version: '1.0.0'
    });

    // Register the consultExpert tool
    try {
      log('Registering consultExpert tool');

      // Create a state map to track workflow state for each conversation
      const consultStates = new Map<string, WorkflowState>();

      server.tool('consultExpert', {
        type: 'object',
        properties: {
          role: {
            type: 'string',
            description: 'The expert role to consult with (productManager, uxDesigner, softwareArchitect)'
          },
          projectInfo: {
            type: 'string',
            description: 'Brief description of the project or message to the expert'
          },
          conversationId: {
            type: 'string',
            description: 'Unique identifier for the conversation'
          }
        },
        required: ['role', 'projectInfo']
      }, async (params: any) => {
        log('consultExpert tool called with params:', params);
        const { role, projectInfo, conversationId = 'default' } = params;

        if (!experts[role]) {
          return {
            error: `Unknown expert role: ${role}. Available roles: ${Object.keys(experts).join(', ')}`
          };
        }

        const expert = experts[role];

        // Map role to stage
        const stageMap: {[key: string]: string} = {
          'productManager': EXPERT_WORKFLOW_STAGES.PRODUCT_DEFINITION,
          'uxDesigner': EXPERT_WORKFLOW_STAGES.UX_DESIGN,
          'softwareArchitect': EXPERT_WORKFLOW_STAGES.TECHNICAL_PLANNING
        };

        // Get or initialize the workflow state for this conversation
        if (!consultStates.has(conversationId)) {
          // Create a new state with the selected expert's stage as the current stage
          const newState = JSON.parse(JSON.stringify(initialState));
          newState.currentStage = stageMap[role];
          consultStates.set(conversationId, newState);
          log('Initialized new consultation state for conversation:', conversationId);
        }

        const state = consultStates.get(conversationId)!;

        // If this is the first message, initialize with welcome message
        if (state.stageData[state.currentStage]?.completedTopics.length === 0) {
          const welcomeMessage = `# Consulting with ${expert.title}

Thank you for providing your project description. I'll help you define the ${state.currentStage.replace('_', ' ')} for your project.

${getStageIntroduction(state.currentStage)}

Let's start by discussing your project: ${projectInfo}`;

          // Initialize the state with the first message
          const result = await handleExpertInteraction(projectInfo, state);
          consultStates.set(conversationId, result.updatedState);

          return { content: welcomeMessage };
        }

        try {
          // Handle the interaction using our expert handler
          const result = await handleExpertInteraction(projectInfo, state);

          // Update the state in our map
          consultStates.set(conversationId, result.updatedState);

          // If a document was generated, save it
          if (result.document && result.isComplete) {
            // Save to regular file
            const filename = `${expert.outputFormat.replace(/\\s+/g, '_').toLowerCase()}.md`;
            await saveDocument(result.document, filename);

            // Also save to scripts directory
            const scriptPath = await saveExpertDocument(result.document, role);

            // Add info about saved document
            result.response += `\n\nDocument saved to ${filename} and ${scriptPath}.`;

            // If this is a PRD, also set up Task Master integration
            if (role === 'productManager') {
              await setupTaskMasterIntegration();

              // Add Task Master info to the response
              result.response += `\n\nYou can now use Task Master to parse this PRD with: "Can you parse the PRD at scripts/prd.txt and generate tasks?"`;
            }
          }

          return { content: result.response };
        } catch (error) {
          logError('Error in consultExpert:', error);
          return {
            error: `Error consulting with ${expert.title}: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      });
    } catch (error) {
      logError('Failed to register consultExpert tool:', error);
    }

    // Register the generateDocument tool
    try {
      log('Registering generateDocument tool');

      // Create a state map to track workflow state for each conversation
      const documentStates = new Map<string, WorkflowState>();

      server.tool('generateDocument', {
        type: 'object',
        properties: {
          role: {
            type: 'string',
            description: 'The expert role to use for document generation'
          },
          projectDetails: {
            type: 'string',
            description: 'Detailed project information or conversation summary'
          },
          saveForTaskMaster: {
            type: 'boolean',
            description: 'Whether to save the document in a format compatible with Task Master'
          },
          conversationId: {
            type: 'string',
            description: 'Unique identifier for the conversation'
          }
        },
        required: ['role', 'projectDetails']
      }, async (params: any) => {
        log('generateDocument tool called with params:', params);
        const { role, projectDetails, saveForTaskMaster: saveForTM = false, conversationId = 'default' } = params;

        if (!experts[role]) {
          return {
            error: `Unknown expert role: ${role}. Available roles: ${Object.keys(experts).join(', ')}`
          };
        }

        const expert = experts[role];

        // Map role to stage
        const stageMap: {[key: string]: string} = {
          'productManager': EXPERT_WORKFLOW_STAGES.PRODUCT_DEFINITION,
          'uxDesigner': EXPERT_WORKFLOW_STAGES.UX_DESIGN,
          'softwareArchitect': EXPERT_WORKFLOW_STAGES.TECHNICAL_PLANNING
        };

        // Get or initialize the workflow state for this conversation
        if (!documentStates.has(conversationId)) {
          // Create a new state with the selected expert's stage as the current stage
          const newState = JSON.parse(JSON.stringify(initialState));
          newState.currentStage = stageMap[role];
          documentStates.set(conversationId, newState);
          log('Initialized new document state for conversation:', conversationId);
        }

        const state = documentStates.get(conversationId)!;

        try {
          // First, mark the current stage as complete
          state.stageData[state.currentStage] = {
            ...state.stageData[state.currentStage],
            completed: true
          };

          // Generate the document using the template
          const template = await readTemplate(expert.templatePath);
          const document = await generateExpertDocument(role, template, projectDetails);

          // Save the document to the state
          state.stageData[state.currentStage].document = document;

          // Save the document to a file
          const filename = `${expert.outputFormat.replace(/\\s+/g, '_').toLowerCase()}.md`;
          await saveDocument(document, filename);

          // Also save to scripts directory
          const scriptPath = await saveExpertDocument(document, role);

          // Prepare message about saved documents
          let saveMessage = `\n\nDocument saved to ${filename} and ${scriptPath}.`;

          // If this is a PRD and saveForTaskMaster is true, also set up Task Master integration
          let taskMasterMessage = '';
          if (role === 'productManager' && saveForTM) {
            await setupTaskMasterIntegration();
            taskMasterMessage = `\n\nYou can now use Task Master to parse this PRD with: "Can you parse the PRD at scripts/prd.txt and generate tasks?"`;
          }

          // Update the state in our map
          documentStates.set(conversationId, state);

          return {
            content: `# ${expert.outputFormat}\n\n${document}${saveMessage}${taskMasterMessage}`
          };
        } catch (error) {
          logError('Error in generateDocument:', error);
          return {
            error: `Error generating ${expert.outputFormat}: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      });
    } catch (error) {
      logError('Failed to register generateDocument tool:', error);
    }

    // Register the expertWorkflow tool
    try {
      log('Registering expertWorkflow tool');

      // Create a state map to track workflow state for each conversation
      const workflowStates = new Map<string, WorkflowState>();

      server.tool('expertWorkflow', {
        type: 'object',
        properties: {
          projectDescription: {
            type: 'string',
            description: 'Description of the project or message to the expert'
          },
          conversationId: {
            type: 'string',
            description: 'Unique identifier for the conversation'
          }
        },
        required: ['projectDescription']
      }, async (params: { projectDescription: string, conversationId?: string }) => {
        log('expertWorkflow tool called with params:', params);

        try {
          const { projectDescription, conversationId = 'default' } = params;
          log('Processing request with input:', projectDescription);

          // Get or initialize the workflow state for this conversation
          if (!workflowStates.has(conversationId)) {
            workflowStates.set(conversationId, JSON.parse(JSON.stringify(initialState)));
            log('Initialized new workflow state for conversation:', conversationId);
          }

          const state = workflowStates.get(conversationId)!;

          // If this is the first message and it looks like a project description, initialize with welcome message
          if (state.completedStages.length === 0 && state.stageData[state.currentStage].completedTopics.length === 0) {
            const isInitialDescription = projectDescription.length > 30 &&
              !projectDescription.toLowerCase().includes('?') &&
              !projectDescription.toLowerCase().includes('hello') &&
              !projectDescription.toLowerCase().includes('hi ');

            if (isInitialDescription) {
              const welcomeMessage = `# Welcome to the AI Expert Workflow

Thank you for providing your project description. I'll guide you through a comprehensive product development process with three expert consultations:

1. **Product Definition** with an AI Product Manager
2. **UX Design** with an AI UX Designer
3. **Technical Architecture** with an AI Software Architect

${getStageIntroduction(EXPERT_WORKFLOW_STAGES.PRODUCT_DEFINITION)}

Let's start by discussing your project: ${projectDescription}`;

              return { content: welcomeMessage };
            }
          }

          // Handle the interaction using our expert handler
          const result = await handleExpertInteraction(projectDescription, state);

          // Update the state in our map
          workflowStates.set(conversationId, result.updatedState);

          // If a document was generated, save it
          if (result.document && result.isComplete) {
            const currentStage = result.updatedState.currentStage;
            const expertName = currentStage === EXPERT_WORKFLOW_STAGES.PRODUCT_DEFINITION ? 'productManager' :
                              currentStage === EXPERT_WORKFLOW_STAGES.UX_DESIGN ? 'uxDesigner' : 'softwareArchitect';

            const expert = experts[expertName];

            // Save to regular file
            const filename = `${expert.outputFormat.replace(/\\s+/g, '_').toLowerCase()}.md`;
            await saveDocument(result.document, filename);

            // Also save to scripts directory
            const scriptPath = await saveExpertDocument(result.document, expertName);

            // Add info about saved document
            result.response += `\n\nDocument saved to ${filename} and ${scriptPath}.`;

            // If this is a PRD, save it as initial_prd.txt
            if (currentStage === EXPERT_WORKFLOW_STAGES.PRODUCT_DEFINITION) {
              // Save as initial_prd.txt since this is just the first phase
              await saveForTaskMaster(result.document, true);

              // Don't set up Task Master integration yet, as we'll wait for the comprehensive document
              result.response += `\n\nInitial PRD saved to scripts/initial_prd.txt. After completing all phases, a comprehensive document will be saved as scripts/prd.txt for Task Master.`;
            }

            // If all stages are complete, inform the user that the PRD has been updated with all expert input
            if (result.updatedState.completedStages.length === Object.keys(EXPERT_WORKFLOW_STAGES).length - 1 &&
                result.updatedState.stageData[result.updatedState.currentStage].completed) {

              // Add info about the complete PRD
              result.response += `\n\nThe PRD file (scripts/prd.txt) has been continuously updated throughout all phases and now contains a comprehensive specification with input from all three experts. You can use this file with Task Master.`;
            }
          }

          return { content: result.response };
        } catch (error) {
          logError('Error in expertWorkflow:', error);
          return {
            error: `Error executing expertWorkflow: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      });
    } catch (error) {
      logError('Failed to register expertWorkflow tool:', error);
    }

    log('All tools registered successfully');
    return server;
  } catch (error) {
    logError('Error creating MCP server:', error);
    return null;
  }
}