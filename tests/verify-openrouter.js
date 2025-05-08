// Verification script for OpenRouter API using command-line argument for API key
const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Get API key from command line argument
const apiKey = process.argv[2];

if (!apiKey) {
  console.error('Error: API key is required as a command-line argument');
  console.error('Usage: node verify-openrouter.js YOUR_API_KEY');
  process.exit(1);
}

// Test function to call OpenRouter API
async function verifyOpenRouterAPI() {
  console.log('Verifying OpenRouter API connection...');

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/martindao/PM_Product_Flow_Pro',
        'X-Title': 'AI Expert Workflow MCP Verification'
      },
      body: JSON.stringify({
        model: 'tngtech/deepseek-r1t-chimera:free', // Using the specified model
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
    console.log('\nVerification successful! Your OpenRouter API key is working correctly.');
    console.log('You can now use this key in your MCP configuration.');
  } else {
    console.error('\nVerification failed! Please check your API key and try again.');
    process.exit(1);
  }
});

# [2025-02-13] (Workflow) schedule note: Document expert workflow for Workflow

# [2025-03-19] (Expert) schedule note: Refine MCP prompt flow for Expert

# [2025-03-27] (MCP) schedule note: Refine MCP prompt flow for MCP

# [2025-05-08] (Workflow) schedule note: Harden OpenRouter integration for Workflow
