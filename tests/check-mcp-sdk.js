// Script to check if the MCP SDK is installed correctly
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the MCP SDK path
const sdkPath = path.resolve(__dirname, '../node_modules/@modelcontextprotocol/sdk');
console.log(`SDK Path: ${sdkPath}`);

// Check if the SDK exists
if (!fs.existsSync(sdkPath)) {
  console.error(`MCP SDK not found at ${sdkPath}`);
  process.exit(1);
}

// List the contents of the SDK directory
console.log('\nContents of SDK directory:');
const sdkContents = fs.readdirSync(sdkPath);
console.log(sdkContents);

// Check for the dist directory
const distPath = path.join(sdkPath, 'dist');
if (!fs.existsSync(distPath)) {
  console.error(`Dist directory not found at ${distPath}`);
  process.exit(1);
}

// List the contents of the dist directory
console.log('\nContents of dist directory:');
const distContents = fs.readdirSync(distPath);
console.log(distContents);

// Check for the cjs directory
const cjsPath = path.join(distPath, 'cjs');
if (!fs.existsSync(cjsPath)) {
  console.error(`CJS directory not found at ${cjsPath}`);
  process.exit(1);
}

// List the contents of the cjs directory
console.log('\nContents of cjs directory:');
const cjsContents = fs.readdirSync(cjsPath);
console.log(cjsContents);

// Check for the server directory
const serverPath = path.join(cjsPath, 'server');
if (!fs.existsSync(serverPath)) {
  console.error(`Server directory not found at ${serverPath}`);
  process.exit(1);
}

// List the contents of the server directory
console.log('\nContents of server directory:');
const serverContents = fs.readdirSync(serverPath);
console.log(serverContents);

// Check for the MCP server file
const mcpJsPath = path.join(serverPath, 'mcp.js');
if (!fs.existsSync(mcpJsPath)) {
  console.error(`MCP server not found at ${mcpJsPath}`);
  process.exit(1);
}

// Check for the stdio transport file
const stdioJsPath = path.join(serverPath, 'stdio.js');
if (!fs.existsSync(stdioJsPath)) {
  console.error(`Stdio transport not found at ${stdioJsPath}`);
  process.exit(1);
}

console.log('\nMCP SDK is installed correctly!');

// Try to import the MCP SDK
try {
  console.log('\nTrying to import MCP SDK...');
  const mcpModule = require(mcpJsPath);
  console.log('MCP module keys:', Object.keys(mcpModule));
  
  if (mcpModule.McpServer) {
    console.log('McpServer found in module!');
  } else {
    console.error('McpServer not found in module!');
    process.exit(1);
  }
} catch (error) {
  console.error('Error importing MCP SDK:', error);
  process.exit(1);
}

// Try to import the stdio transport
try {
  console.log('\nTrying to import stdio transport...');
  const stdioModule = require(stdioJsPath);
  console.log('Stdio module keys:', Object.keys(stdioModule));
  
  if (stdioModule.StdioServerTransport) {
    console.log('StdioServerTransport found in module!');
  } else {
    console.error('StdioServerTransport not found in module!');
    process.exit(1);
  }
} catch (error) {
  console.error('Error importing stdio transport:', error);
  process.exit(1);
}

console.log('\nAll checks passed! MCP SDK is installed correctly and can be imported.');
