// Test script for MCP server functionality only (no API calls)
const { createMCPServer } = require('../dist/mcp');

// Test function to verify MCP server creation
async function testMCPServer() {
  console.log('Testing MCP server creation...');

  try {
    // Create the MCP server
    const server = createMCPServer();
    
    if (!server) {
      console.error('Error: MCP server creation failed');
      return false;
    }

    // Check if server object has the expected structure
    if (!server.tool || typeof server.tool !== 'function') {
      console.error('Error: MCP server does not have a tool method');
      return false;
    }
    
    console.log('MCP server created successfully!');
    return true;
  } catch (error) {
    console.error('Error creating MCP server:', error.message);
    return false;
  }
}

// Run the test
async function runTest() {
  console.log('Running MCP server test...\n');

  // Test MCP server creation
  const mcpTestSuccess = await testMCPServer();

  // Report results
  console.log('\n=== Test Results ===');
  console.log(`MCP Server Test: ${mcpTestSuccess ? 'PASSED' : 'FAILED'}`);

  // Exit with appropriate code
  if (mcpTestSuccess) {
    console.log('\nMCP server test passed successfully!');
    process.exit(0);
  } else {
    console.error('\nMCP server test failed. Please check the logs above for details.');
    process.exit(1);
  }
}

// Run the test
runTest();
