#!/usr/bin/env node

/**
 * Standalone script to generate a PRD using the AI Expert Workflow
 * This script can be used without Task Master installed
 */

const { consultWithExpert, generateExpertDocument } = require('./dist/utils/aiUtils');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Get project description from command line arguments
const projectDescription = process.argv.slice(2).join(' ');

if (!projectDescription) {
  console.error('Error: Project description is required');
  console.log('Usage: node generate-prd.js "Your detailed project description"');
  process.exit(1);
}

// Check for OpenRouter API key
const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error('Error: OPENROUTER_API_KEY environment variable is required');
  console.log('Please set your OpenRouter API key:');
  console.log('export OPENROUTER_API_KEY=your_key_here');
  process.exit(1);
}

// Get model from environment or use default
const model = process.env.OPENROUTER_MODEL || 'tngtech/deepseek-r1t-chimera:free';

console.log('Generating PRD using AI Expert Workflow...');
console.log(`Model: ${model}`);
console.log('Project description:', projectDescription);
console.log('\nThis may take a minute or two. Please wait...\n');

async function generatePRD() {
  try {
    // First, consult with the Product Manager
    console.log('Consulting with AI Product Manager...');
    const consultation = await consultWithExpert('productManager', projectDescription);
    
    // Then, generate the PRD document
    console.log('Generating PRD document...');
    const prdContent = await generateExpertDocument('productManager', projectDescription, false);
    
    // Save the PRD to a file
    const prdPath = path.join(process.cwd(), 'prd.md');
    fs.writeFileSync(prdPath, prdContent, 'utf8');
    console.log(`\nPRD successfully generated and saved to: ${prdPath}`);
    
    // Also save in Task Master compatible format (optional)
    const scriptsDir = path.join(process.cwd(), 'scripts');
    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir, { recursive: true });
    }
    const taskMasterPath = path.join(scriptsDir, 'prd.txt');
    fs.writeFileSync(taskMasterPath, prdContent, 'utf8');
    console.log(`PRD also saved in Task Master compatible format at: ${taskMasterPath}`);
    
    console.log('\n=== Next Steps ===');
    console.log('1. Review your PRD in prd.md');
    console.log('2. If you want to generate tasks from this PRD:');
    console.log('   - Install Task Master: npm install -g task-master-ai');
    console.log('   - Parse the PRD: task-master parse-prd scripts/prd.txt');
    console.log('   - Or use Task Master in your editor: "Can you parse the PRD at scripts/prd.txt and generate tasks?"');
    
    return prdContent;
  } catch (error) {
    console.error('Error generating PRD:', error.message);
    process.exit(1);
  }
}

// Run the PRD generation
generatePRD();
