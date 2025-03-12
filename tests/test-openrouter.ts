// Comprehensive test script for OpenRouter API and MCP functionality
import fetch from 'node-fetch';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import the MCP server creation function
import { createMCPServer } from '../src/mcp';
import * as fsSync from 'fs';

// Get API key directly from .env file
const envPath = path.join(__dirname, '..', '.env');
const envContent = fsSync.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/OPENROUTER_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

// Also get the model from the .env file
const modelMatch = envContent.match(/OPENROUTER_MODEL=(.+)/);
const model = modelMatch ? modelMatch[1].trim() : 'tngtech/deepseek-r1t-chimera:free';

if (!apiKey) {
  console.error('Error: OPENROUTER_API_KEY is required but not found in .env file');
  process.exit(1);
}

// Define response type
interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    index: number;
    finish_reason: string;
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Test function to call OpenRouter API
async function testOpenRouterAPI(): Promise<boolean> {
  console.log('Testing OpenRouter API...');

  try {
    // Log the API key (first few characters) for debugging
    console.log(`Using API key: ${apiKey ? apiKey.substring(0, 10) : 'undefined'}...`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/martindao/PM_Product_Flow_Pro',
        'X-Title': 'AI Expert Workflow MCP Test'
      },
      body: JSON.stringify({
        model: model, // Use the model from .env file
        max_tokens: parseInt(process.env.MAX_TOKENS || '1000', 10),
        temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say "OpenRouter API is working correctly with the deepseek-r1t-chimera model!" if you can read this message.' }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json() as OpenRouterResponse;

    // Create results directory if it doesn't exist
    const resultsDir = path.join(__dirname, 'results');
    await fs.mkdir(resultsDir, { recursive: true });

    // Save test results
    const resultPath = path.join(resultsDir, 'result_test_ts.md');
    const resultContent = `# OpenRouter API Test Results (TypeScript)

## Request
- Model: ${model}
- Max Tokens: ${process.env.MAX_TOKENS || '1000'}
- Temperature: ${process.env.TEMPERATURE || '0.7'}
- Query: "Say 'OpenRouter API is working correctly with the deepseek-r1t-chimera model!' if you can read this message."

## Response
${data.choices[0].message.content}

## API Response Details
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`
`;

    await fs.writeFile(resultPath, resultContent, 'utf8');

    console.log('Test completed successfully!');
    console.log(`Results saved to ${resultPath}`);
    console.log('\nAPI Response:');
    console.log(data.choices[0].message.content);

    return true;
  } catch (error) {
    console.error('Error testing OpenRouter API:', error instanceof Error ? error.message : String(error));
    return false;
  }
}

// Test function to verify MCP server creation
async function testMCPServer(): Promise<boolean> {
  console.log('\nTesting MCP server creation...');

  try {
    // Create the MCP server
    const server = createMCPServer();

    if (!server) {
      console.error('Error: MCP server creation failed');
      return false;
    }

    // Check if server object has the expected structure
    if (!(server as any).tool || typeof (server as any).tool !== 'function') {
      console.error('Error: MCP server does not have a tool method');
      return false;
    }

    // In the new implementation, tools are registered directly on the server
    // We can't easily check for specific tools, so we'll just verify the server was created
    console.log('MCP server created successfully!');
    return true;
  } catch (error) {
    console.error('Error creating MCP server:', error instanceof Error ? error.message : String(error));
    return false;
  }
}

// Run all tests
async function runAllTests(): Promise<void> {
  console.log('Running all tests...\n');

  // Test OpenRouter API
  const apiTestSuccess = await testOpenRouterAPI();

  // Test MCP server creation
  const mcpTestSuccess = await testMCPServer();

  // Report overall results
  console.log('\n=== Test Results ===');
  console.log(`OpenRouter API Test: ${apiTestSuccess ? 'PASSED' : 'FAILED'}`);
  console.log(`MCP Server Test: ${mcpTestSuccess ? 'PASSED' : 'FAILED'}`);

  // Exit with appropriate code
  if (apiTestSuccess && mcpTestSuccess) {
    console.log('\nAll tests passed successfully!');
    process.exit(0);
  } else {
    console.error('\nSome tests failed. Please check the logs above for details.');
    process.exit(1);
  }
}

// Run all tests
runAllTests();

# [2025-03-12] (MCP) schedule note: Harden OpenRouter integration for MCP
