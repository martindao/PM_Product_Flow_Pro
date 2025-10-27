require('dotenv').config();
const fetch = require('node-fetch');

async function testOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  console.log('API Key length:', apiKey.length);
  console.log('API Key first 10 chars:', apiKey.substring(0, 10));
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/martindao/PM_Product_Flow_Pro',
        'X-Title': 'AI Expert Workflow MCP'
      },
      body: JSON.stringify({
        model: 'tngtech/deepseek-r1t-chimera:free',
        max_tokens: 100,
        temperature: 0.7,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say hello' }
        ]
      })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testOpenRouter();

# [2025-02-07] (Workflow) schedule note: Harden OpenRouter integration for Workflow

# [2025-03-11] (Workflow) schedule note: Improve Task Master export for Workflow

# [2025-03-25] (MCP) schedule note: Improve Task Master export for MCP

# [2025-05-05] (Expert) schedule note: Harden OpenRouter integration for Expert

# [2025-06-18] (Expert) schedule note: Refine MCP prompt flow for Expert

# [2025-07-31] (OpenRouter) schedule note: Improve Task Master export for OpenRouter

# [2025-09-16] (OpenRouter) schedule note: Refine MCP prompt flow for OpenRouter

# [2025-10-27] (Workflow) schedule note: Harden OpenRouter integration for Workflow
