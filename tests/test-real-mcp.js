// Script to test the real MCP server
const fs = require('fs');
const path = require('path');

// Get the MCP SDK path
const sdkPath = path.resolve(__dirname, '../node_modules/@modelcontextprotocol/sdk');
console.log(`SDK Path: ${sdkPath}`);

// Check if the SDK exists
if (!fs.existsSync(sdkPath)) {
  console.error(`MCP SDK not found at ${sdkPath}`);
  process.exit(1);
}

// Check for the MCP server file
const mcpJsPath = path.join(sdkPath, 'dist/cjs/server/mcp.js');
console.log(`MCP JS Path: ${mcpJsPath}`);

if (!fs.existsSync(mcpJsPath)) {
  console.error(`MCP server not found at ${mcpJsPath}`);
  process.exit(1);
}

// Check for the stdio transport file
const stdioJsPath = path.join(sdkPath, 'dist/cjs/server/stdio.js');
console.log(`Stdio JS Path: ${stdioJsPath}`);

if (!fs.existsSync(stdioJsPath)) {
  console.error(`Stdio transport not found at ${stdioJsPath}`);
  process.exit(1);
}

// Try to import the MCP SDK
try {
  console.log('Importing MCP SDK...');
  const { McpServer } = require(mcpJsPath);
  console.log('MCP SDK imported successfully!');
  
  // Try to create a server
  console.log('Creating MCP server...');
  const server = new McpServer({
    name: 'test-server',
    version: '1.0.0'
  });
  console.log('MCP server created successfully!');
  
  // Try to import the stdio transport
  console.log('Importing stdio transport...');
  const { StdioServerTransport } = require(stdioJsPath);
  console.log('Stdio transport imported successfully!');
  
  // Try to create a transport
  console.log('Creating transport...');
  const transport = new StdioServerTransport();
  console.log('Transport created successfully!');
  
  // Try to connect the server to the transport
  console.log('Connecting server to transport...');
  server.connect(transport).then(() => {
    console.log('Server connected successfully!');
    process.exit(0);
  }).catch(error => {
    console.error('Error connecting server:', error);
    process.exit(1);
  });
} catch (error) {
  console.error('Error importing MCP SDK:', error);
  process.exit(1);
}
