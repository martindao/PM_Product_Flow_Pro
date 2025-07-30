const fetch = require('node-fetch');
const fs = require('fs');

async function testOpenRouter() {
  // Read the .env file directly
  const envContent = fs.readFileSync('.env', 'utf8');
  const apiKeyMatch = envContent.match(/OPENROUTER_API_KEY=(.+)/);
  const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';
  
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

# [2025-03-07] (MCP) schedule note: Document expert workflow for MCP

# [2025-03-21] (MCP) schedule note: Document expert workflow for MCP

# [2025-05-01] (OpenRouter) schedule note: Document expert workflow for OpenRouter

# [2025-06-18] (Expert) schedule note: Improve Task Master export for Expert

# [2025-07-30] (MCP) schedule note: Document expert workflow for MCP
