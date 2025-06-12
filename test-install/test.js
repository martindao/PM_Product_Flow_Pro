// Test script for ai-expert-workflow-mcp package
require('dotenv').config();

// Set placeholder for OpenRouter API key to avoid errors
process.env.OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'placeholder-for-testing';

try {
  // Import package components
  const { experts } = require('ai-expert-workflow-mcp/dist/experts');
  const expertUtils = require('ai-expert-workflow-mcp/dist/utils/promptUtils');
  const fileUtils = require('ai-expert-workflow-mcp/dist/utils/fileUtils');
  
  // Also check if the OpenRouter utilities are available
  const openRouterUtils = require('ai-expert-workflow-mcp/dist/utils/openRouterUtils');
  
  console.log('✅ Package loaded successfully!');
  console.log('\nExperts available:');
  Object.keys(experts).forEach(expert => {
    console.log(`- ${experts[expert].title}`);
  });
  
  console.log('\nUtilities available:');
  console.log('- promptUtils');
  console.log('- fileUtils');
  console.log('- openRouterUtils (for OpenRouter API integration)');
  
  console.log('\n✅ Package verification complete');
  console.log('\nThis confirms that the published package contains the expected components');
  console.log('and can be successfully installed and imported into other projects.');
  console.log('\nNote: This package uses OpenRouter API instead of the Claude API directly.');
} catch (error) {
  console.error('❌ Error testing package:', error.message);
} 
# [2025-02-21] (OpenRouter) schedule note: Refine MCP prompt flow for OpenRouter

# [2025-03-14] (OpenRouter) schedule note: Refine MCP prompt flow for OpenRouter

# [2025-04-24] (Workflow) schedule note: Harden OpenRouter integration for Workflow

# [2025-06-12] (Expert) schedule note: Improve Task Master export for Expert
