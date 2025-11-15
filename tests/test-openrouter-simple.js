// Simple test script for OpenRouter API only
const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Get OpenRouter API key
const apiKey = process.env.OPENROUTER_API_KEY || '';
if (!apiKey) {
  console.error('Error: OPENROUTER_API_KEY is required but not set in environment variables');
  process.exit(1);
}

// Test function to call OpenRouter API
async function testOpenRouterAPI() {
  console.log('Testing OpenRouter API...');
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/yourusername/ai-expert-workflow-mcp',
        'X-Title': 'AI Expert Workflow MCP Test'
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo',
        max_tokens: parseInt(process.env.MAX_TOKENS || '1000', 10),
        temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Hello, can you give me a brief introduction to the Model Context Protocol (MCP)?' }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Create results directory if it doesn't exist
    const resultsDir = path.join(__dirname, 'results');
    await fs.mkdir(resultsDir, { recursive: true });
    
    // Save test results
    const resultPath = path.join(resultsDir, 'result_test_simple.md');
    const resultContent = `# OpenRouter API Test Results

## Request
- Model: ${process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo'}
- Max Tokens: ${process.env.MAX_TOKENS || '1000'}
- Temperature: ${process.env.TEMPERATURE || '0.7'}
- Query: "Hello, can you give me a brief introduction to the Model Context Protocol (MCP)?"

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
    console.error('Error testing OpenRouter API:', error.message);
    return false;
  }
}

// Run the test
testOpenRouterAPI().then(success => {
  if (!success) {
    process.exit(1);
  }
});
