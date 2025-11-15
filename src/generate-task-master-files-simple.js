// Simple script to demonstrate Task Master integration without using MCP
const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

// Get OpenRouter API key
const apiKey = process.env.OPENROUTER_API_KEY || '';
if (!apiKey) {
  console.error('Error: OPENROUTER_API_KEY is required but not set in environment variables');
  process.exit(1);
}

async function generateDocument(template, userInput) {
  const systemPrompt = `You are an expert AI Product Manager with extensive experience creating clear, actionable PRDs.
  Your goal is to help the user define their product vision and requirements in a structured document.
  Ask clarifying questions to understand the product goals, target users, key features, and success metrics.
  Organize information into a comprehensive PRD with clear sections including:
  - Product Overview
  - Problem Statement
  - User Personas
  - User Stories/Jobs to be Done
  - Feature Requirements (with priority levels)
  - Success Metrics
  - Timeline and Milestones
  - MVP Summary (clearly defining the minimum viable product scope)
  - Business Model (outlining monetization strategy and pricing)
  - Lean Startup Validation Plan (hypotheses to test and metrics to track)
  
  Be thorough but concise. Focus on actionable requirements that developers can implement.`;

  const enhancedPrompt = `${systemPrompt}\n\nPlease use the following template structure for your response:\n\n${template}\n\nBased on the user's input, create a complete, well-structured document. Format your response using Markdown with clear sections and subsections.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/yourusername/ai-expert-workflow-mcp',
        'X-Title': 'AI Expert Workflow MCP'
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo',
        max_tokens: parseInt(process.env.MAX_TOKENS || '8000', 10),
        temperature: parseFloat(process.env.TEMPERATURE || '0.5'),
        messages: [
          { role: 'system', content: enhancedPrompt },
          { role: 'user', content: userInput }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Get the response text
    const responseText = data.choices[0].message.content || '';
    return responseText;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
}

async function saveForTaskMaster(content) {
  try {
    // Create scripts directory if it doesn't exist
    const scriptsDir = path.join(process.cwd(), 'scripts');
    try {
      await fs.mkdir(scriptsDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    // Save to scripts/prd.txt for Task Master compatibility
    const filePath = path.join(scriptsDir, 'prd.txt');
    await fs.writeFile(filePath, content, 'utf8');

    return filePath;
  } catch (error) {
    console.error('Error saving for Task Master:', error);
    throw error;
  }
}

async function setupTaskMasterIntegration() {
  try {
    // Create .cursor directory and rules if it doesn't exist
    const cursorDir = path.join(process.cwd(), '.cursor', 'rules');
    await fs.mkdir(cursorDir, { recursive: true });
    
    // Create dev_workflow.mdc file for Cursor integration
    const devWorkflowContent = `# Task Master Development Workflow

## Overview
- Task Master is an AI-driven development tool that helps organize and manage tasks
- It integrates with Claude and Cursor to provide a seamless development experience
- This workflow explains how to use Task Master effectively

## Commands
- Use \`parse-prd\` to generate tasks from a PRD
- Use \`list\` to see all tasks
- Use \`next\` to get the next task to work on
- Use \`generate\` to generate code for a specific task

## Integration with AI Expert Workflow
- AI Expert Workflow generates comprehensive PRDs
- These PRDs can be parsed by Task Master to create tasks
- The workflow creates a seamless planning-to-implementation pipeline

## Examples
To parse a PRD:
\`\`\`
Can you parse the PRD at scripts/prd.txt and generate tasks?
\`\`\`

To get the next task:
\`\`\`
What's the next task I should work on?
\`\`\`
`;
    
    await fs.writeFile(path.join(cursorDir, 'dev_workflow.mdc'), devWorkflowContent, 'utf8');
    
    return;
  } catch (error) {
    console.error('Error setting up Task Master integration:', error);
    throw error;
  }
}

async function generateTaskMasterFiles() {
  try {
    console.log('Generating Task Master integration files...');
    
    // Read the template
    console.log('Reading template...');
    const templatePath = path.join(process.cwd(), 'templates', 'prd-template.md');
    const template = await fs.readFile(templatePath, 'utf8');
    
    // Sample project details
    const projectDetails = `
      I want to build a recipe app that helps users find recipes based on ingredients they have at home.
      Target users are home cooks who want to reduce food waste and save money by using what they already have.
      Key features should include ingredient search, recipe display, saving favorites, and generating shopping lists.
    `;
    
    // Generate the document
    console.log('Generating document with OpenRouter API...');
    const document = await generateDocument(template, projectDetails);
    
    // Save the document to a file
    const filename = 'prd.md';
    const filePath = path.join(process.cwd(), filename);
    await fs.writeFile(filePath, document, 'utf8');
    console.log(`Document saved to ${filePath}`);
    
    // Save for Task Master
    console.log('Saving for Task Master...');
    const tmPath = await saveForTaskMaster(document);
    console.log(`Document saved for Task Master at ${tmPath}`);
    
    // Setup Task Master integration
    console.log('Setting up Task Master integration...');
    await setupTaskMasterIntegration();
    console.log('Task Master integration setup complete');
    
    console.log('\nTask Master integration files generated successfully!');
    console.log('\nYou can now use Task Master to parse the PRD with:');
    console.log('"Can you parse the PRD at scripts/prd.txt and generate tasks?"');
    
  } catch (error) {
    console.error('Error generating Task Master files:', error);
  }
}

// Run the function
generateTaskMasterFiles();
