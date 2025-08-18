#!/usr/bin/env node

/**
 * Standalone PRD Generation with Optional Task Master Integration
 *
 * This script generates a comprehensive PRD using AI Expert Workflow:
 * 1. Generates a PRD using the AI Product Manager
 * 2. Saves it as a standalone document (prd.md)
 * 3. Optionally saves it in Task Master compatible format (if you want to use Task Master later)
 *
 * Usage:
 *   - npm package: npx ai-expert-workflow-generate "Your detailed project description"
 *   - local: node generate-and-parse.js "Your detailed project description"
 *
 * Requirements:
 *   - OpenRouter API key (set as OPENROUTER_API_KEY environment variable)
 *   - Node.js 14 or higher
 *
 * Installation:
 *   - Global: npm install -g ai-expert-workflow-mcp
 *   - Local: npm install ai-expert-workflow-mcp
 *
 * Environment Setup:
 *   - Create a .env file in your project root with OPENROUTER_API_KEY=your_key_here
 *   - Or set environment variable directly: export OPENROUTER_API_KEY=your_key_here
 *
 * Note: Task Master is completely optional. You can use this script to generate
 * PRDs without ever installing or using Task Master.
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const packageJson = require('./package.json');

// Load environment variables from .env file if present
try {
  require('dotenv').config();
} catch (error) {
  console.warn('⚠️ Warning: Failed to load dotenv module. Environment variables must be set manually.');
}

// Display version information
console.log(`AI Expert Workflow v${packageJson.version}\n`);

// Check if OpenRouter API key is set
if (!process.env.OPENROUTER_API_KEY) {
  console.error('❌ Error: OPENROUTER_API_KEY is not set in your environment variables');
  console.log('\nPlease set your OpenRouter API key using one of these methods:');
  console.log('1. Create a .env file in your project root with:');
  console.log('   OPENROUTER_API_KEY=your_key_here');
  console.log('2. Set it as an environment variable:');
  console.log('   export OPENROUTER_API_KEY=your_key_here');
  console.log('\nYou can get an OpenRouter API key from: https://openrouter.ai/keys');
  process.exit(1);
}

// Get project description from command line arguments
const projectDescription = process.argv.slice(2).join(' ');
if (!projectDescription) {
  console.error('❌ Error: No project description provided');
  console.log('\nUsage:');
  console.log('  • Global installation:');
  console.log('    ai-expert-workflow-generate "Your detailed project description"');
  console.log('  • Using npx:');
  console.log('    npx ai-expert-workflow-generate "Your detailed project description"');
  console.log('  • Local installation:');
  console.log('    node generate-and-parse.js "Your detailed project description"');
  console.log('\nExample:');
  console.log('  ai-expert-workflow-generate "Create a task management web app for remote teams with real-time collaboration features"');
  process.exit(1);
}

// Import utilities
let generateExpertDocument, saveForTaskMaster, readTemplate, experts;
try {
  ({ generateExpertDocument, saveForTaskMaster } = require('./dist/utils/aiUtils'));
  ({ readTemplate } = require('./dist/utils/fileUtils'));
  ({ experts } = require('./dist/experts'));
} catch (error) {
  console.error('❌ Error: Failed to import required modules. This might indicate an incomplete installation.');
  console.log('\nTroubleshooting steps:');
  console.log('1. Check that the package was built correctly:');
  console.log('   npm run build');
  console.log('2. Reinstall the package:');
  console.log('   npm install -g ai-expert-workflow-mcp@latest');
  console.log('3. If the issue persists, please report it at:');
  console.log('   https://github.com/martindao/PM_Product_Flow_Pro/issues');
  process.exit(1);
}

// Function to check if Task Master AI is installed
function isTaskMasterInstalled() {
  try {
    const result = execSync('npm list -g task-master-ai', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    return result.includes('task-master-ai');
  } catch (error) {
    return false;
  }
}

// Function to provide Task Master integration instructions
function provideTaskMasterInstructions(prdPath) {
  console.log('\n📋 Next Steps:');

  console.log('\n✅ Your PRD is ready! You can now:');
  console.log('   1. Review your PRD at prd.md');
  console.log('   2. Share it with your team');
  console.log('   3. Use it for development planning');

  console.log('\n📌 Optional: Task Master Integration');
  console.log('   If you want to convert your PRD into development tasks, you can use Task Master:');

  // Option 1: MCP integration
  console.log('\n1️⃣ Option 1: MCP Integration');
  console.log('   Add the Task Master MCP to your editor configuration:');
  console.log('   ```json');
  console.log('   "mcpServers": {');
  console.log('     "taskmaster-ai": {');
  console.log('       "command": "npx",');
  console.log('       "args": ["-y", "task-master-ai"],');
  console.log('       "env": {');
  console.log('         "ANTHROPIC_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE",');
  console.log('         "MODEL": "claude-3-sonnet-20240229"');
  console.log('       }');
  console.log('     }');
  console.log('   }');
  console.log('   ```');
  console.log('   Then, ask your AI assistant:');
  console.log(`   "Can you parse the PRD at ${prdPath} and generate tasks?"`);

  // Option 2: CLI usage
  console.log('\n2️⃣ Option 2: Command Line Usage');
  console.log('   1. Install Task Master:');
  console.log('      npm install -g task-master-ai');
  console.log('   2. Parse the PRD:');
  console.log(`      task-master parse-prd ${prdPath}`);

  console.log('\n⚠️ Note: Task Master is completely optional. You can use your PRD without it.');
}

async function main() {
  try {
    console.log('🚀 Starting standalone PRD generation');
    console.log('\n📝 Step 1: Generating PRD document from your project description...');

    // Get the product manager template
    let template;
    try {
      const templatePath = 'templates/prd-template.md';
      template = await readTemplate(templatePath);
    } catch (error) {
      console.error('❌ Error reading template:', error.message);
      console.log('Continuing with default template...');
      template = `# Product Requirements Document\n\n## Product Overview\n[Overview goes here]\n\n## Problem Statement\n[Problem statement goes here]`;
    }

    // Generate the PRD document
    let document;
    try {
      document = await generateExpertDocument(
        'productManager',
        template,
        projectDescription
      );
      console.log('✅ PRD generation complete');
    } catch (error) {
      console.error('❌ Error generating PRD document:', error.message);
      console.log('\nPossible causes:');
      console.log('1. Invalid OpenRouter API key');
      console.log('2. Network connectivity issues');
      console.log('3. OpenRouter service might be experiencing problems');
      console.log('\nTry again later or check your API key at: https://openrouter.ai/keys');
      process.exit(1);
    }

    // Save the document as a standalone PRD
    try {
      console.log('\n💾 Step 2: Saving standalone PRD document...');
      const prdFilePath = path.join(process.cwd(), 'prd.md');
      fs.writeFileSync(prdFilePath, document, 'utf8');
      console.log(`✅ PRD saved at ${prdFilePath}`);
    } catch (error) {
      console.error('❌ Error saving PRD document:', error.message);
      console.log('Please check file permissions in your project directory.');
      process.exit(1);
    }

    // Optionally save in Task Master format
    try {
      console.log('\n💾 Step 3: Also saving in Task Master compatible format (optional)...');
      const tmPath = await saveForTaskMaster(document);
      console.log(`✅ Also saved at ${tmPath} (for Task Master integration if needed later)`);
    } catch (error) {
      console.error('❌ Error saving document for Task Master:', error.message);
      console.log('This is optional - your PRD is still available at prd.md');
    }

    // Check if task-master-ai is installed
    console.log('\n🔍 Step 4: Checking for Task Master installation (optional)...');
    const taskMasterInstalled = isTaskMasterInstalled();

    try {
      // Save the document to a predictable location for Task Master
      const scriptDir = path.join(process.cwd(), 'scripts');
      const prdPath = path.join(scriptDir, 'prd.txt');

      // Ensure scripts directory exists
      if (!fs.existsSync(scriptDir)) {
        fs.mkdirSync(scriptDir, { recursive: true });
      }

      // Save the PRD
      fs.writeFileSync(prdPath, document, 'utf8');
      console.log('✅ PRD saved for Task Master parsing');

      if (taskMasterInstalled) {
        console.log('\n📌 Task Master AI is installed on your system (optional).');
        provideTaskMasterInstructions(prdPath);
      } else {
        console.log('\n📌 Task Master AI is not installed (this is completely fine).');
        provideTaskMasterInstructions(prdPath);
      }
    } catch (error) {
      console.error('❌ Error checking for Task Master:', error.message);
      console.log('This is optional - your PRD is still available at prd.md');
      provideTaskMasterInstructions('scripts/prd.txt');
    }

    console.log('\n✅ PRD generation complete!');
    console.log('\n📚 Documentation: https://github.com/martindao/PM_Product_Flow_Pro#readme');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.log('\nPlease report this issue at: https://github.com/martindao/PM_Product_Flow_Pro/issues');
    process.exit(1);
  }
}

main();

# [2025-01-10] (OpenRouter) schedule note: Document expert workflow for OpenRouter

# [2025-01-23] (Expert) schedule note: Refine MCP prompt flow for Expert

# [2025-02-28] (Expert) schedule note: Refine MCP prompt flow for Expert

# [2025-04-11] (OpenRouter) schedule note: Improve Task Master export for OpenRouter

# [2025-05-27] (Workflow) schedule note: Improve Task Master export for Workflow

# [2025-07-09] (MCP) schedule note: Harden OpenRouter integration for MCP

# [2025-08-18] (Workflow) schedule note: Refine MCP prompt flow for Workflow
