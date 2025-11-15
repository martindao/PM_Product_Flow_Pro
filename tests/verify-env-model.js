// Script to verify the OpenRouter API using the model from the .env file
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Read the .env file directly
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Extract the API key and model
const apiKeyMatch = envContent.match(/OPENROUTER_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

const modelMatch = envContent.match(/OPENROUTER_MODEL=(.+)/);
const model = modelMatch ? modelMatch[1].trim() : 'tngtech/deepseek-r1t-chimera:free';

if (!apiKey) {
  console.error('Error: OPENROUTER_API_KEY is required but not found in .env file');
  process.exit(1);
}

console.log(`Using API key: ${apiKey.substring(0, 10)}...`);
console.log(`Using model: ${model}`);

async function verifyOpenRouterAPI() {
  console.log('\nVerifying OpenRouter API connection...');
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/yourusername/ai-expert-workflow-mcp',
        'X-Title': 'AI Expert Workflow MCP Verification'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 100,
        temperature: 0.7,
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

    const data = await response.json();
    
    console.log('\n=== OpenRouter API Verification Results ===');
    console.log('Status: SUCCESS');
    console.log('Response:');
    console.log(data.choices[0].message.content);
    console.log('\nModel used:', data.model);
    console.log('Tokens used:', data.usage.total_tokens);
    
    return true;
  } catch (error) {
    console.error('\n=== OpenRouter API Verification Results ===');
    console.error('Status: FAILED');
    console.error('Error:', error.message);
    return false;
  }
}

// Run the verification
verifyOpenRouterAPI().then(success => {
  if (success) {
    console.log('\nVerification successful! Your OpenRouter API key is working correctly with the model from .env file.');
  } else {
    console.error('\nVerification failed! Please check your API key and model in the .env file.');
    process.exit(1);
  }
});
