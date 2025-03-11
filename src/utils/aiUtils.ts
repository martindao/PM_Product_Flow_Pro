import dotenv from 'dotenv';
import { experts } from '../experts';
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

dotenv.config();

// Get OpenRouter API key
function getApiKey(): string {
  // Force reload of .env file
  dotenv.config({ path: '.env' });

  const apiKey = process.env.OPENROUTER_API_KEY || '';
  console.log('API Key:', apiKey);

  if (!apiKey) {
    console.error('Error: OPENROUTER_API_KEY is required but not set in environment variables');
    process.exit(1);
  }
  return apiKey;
}

// Generic function to call AI with any prompt and context
export async function callAI(systemPrompt: string, context: string, userInput: string): Promise<string> {
  try {
    const apiKey = getApiKey();

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/martindao/PM_Product_Flow_Pro',
      'X-Title': 'AI Expert Workflow MCP'
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo',
        max_tokens: parseInt(process.env.MAX_TOKENS || '4000', 10),
        temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
        messages: [
          { role: 'system', content: systemPrompt },
          ...(context ? [{ role: 'user', content: context }] : []),
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

export async function consultWithExpert(role: string, userInput: string): Promise<string> {
  const expert = experts[role];
  if (!expert) {
    throw new Error(`Unknown expert role: ${role}`);
  }

  return callAI(expert.systemPrompt, '', userInput);
}

export async function generateExpertDocument(role: string, template: string, userInput: string): Promise<string> {
  const expert = experts[role];
  if (!expert) {
    throw new Error(`Unknown expert role: ${role}`);
  }

  const enhancedPrompt = `${expert.systemPrompt}\n\nPlease use the following template structure for your response:\n\n${template}\n\nBased on the user's input, create a complete, well-structured document. Format your response using Markdown with clear sections and subsections.`;

  // Use higher max tokens and lower temperature for document generation
  const originalMaxTokens = process.env.MAX_TOKENS;
  const originalTemperature = process.env.TEMPERATURE;

  try {
    process.env.MAX_TOKENS = '8000';
    process.env.TEMPERATURE = '0.5';

    return await callAI(enhancedPrompt, '', userInput);
  } finally {
    // Restore original values
    process.env.MAX_TOKENS = originalMaxTokens;
    process.env.TEMPERATURE = originalTemperature;
  }
}

// Special function to save PRD in the format Task Master expects
export async function saveForTaskMaster(content: string, isInitial: boolean = false): Promise<string> {
  try {
    // Create scripts directory if it doesn't exist
    const scriptsDir = path.join(process.cwd(), 'scripts');
    try {
      await fs.mkdir(scriptsDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    // Determine the filename based on whether this is the initial PRD or the final one
    const filename = isInitial ? 'initial_prd.txt' : 'prd.txt';
    const filePath = path.join(scriptsDir, filename);
    await fs.writeFile(filePath, content, 'utf8');

    return filePath;
  } catch (error) {
    console.error('Error saving for Task Master:', error);
    throw error;
  }
}

# [2025-02-10] (Workflow) schedule note: Refine MCP prompt flow for Workflow

# [2025-03-11] (Workflow) schedule note: Harden OpenRouter integration for Workflow
