// Script to update the mcp-config.json file with a new API key
const fs = require('fs').promises;
const path = require('path');

// Get API key from command line argument
const apiKey = process.argv[2];

if (!apiKey) {
  console.error('Error: API key is required as a command-line argument');
  console.error('Usage: node update-mcp-config.js YOUR_API_KEY');
  process.exit(1);
}

async function updateMcpConfig() {
  try {
    // Path to mcp-config.json
    const configPath = path.join(__dirname, '..', 'mcp-config.json');

    // Read the current config
    const configData = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configData);

    // Update the API key
    if (config.mcpServers && config.mcpServers['ai-expert-workflow']) {
      // Save the old key for reference
      const oldKey = config.mcpServers['ai-expert-workflow'].env.OPENROUTER_API_KEY;

      // Update the key
      config.mcpServers['ai-expert-workflow'].env.OPENROUTER_API_KEY = apiKey;

      // Ensure the model is set to tngtech/deepseek-r1t-chimera:free
      config.mcpServers['ai-expert-workflow'].env.OPENROUTER_MODEL = 'tngtech/deepseek-r1t-chimera:free';

      // Write the updated config back to the file
      await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');

      console.log('MCP config updated successfully!');
      console.log(`Old API key: ${oldKey}`);
      console.log(`New API key: ${apiKey}`);
      console.log(`Model: tngtech/deepseek-r1t-chimera:free`);
    } else {
      throw new Error('Invalid mcp-config.json structure');
    }
  } catch (error) {
    console.error('Error updating MCP config:', error.message);
    process.exit(1);
  }
}

// Run the update
updateMcpConfig();
