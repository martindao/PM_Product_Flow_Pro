#!/usr/bin/env node

import { createMCPServer, waitForMcpSdk } from './mcp';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

// Get package version
let packageVersion = '2.1.3'; // Default fallback version
try {
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageVersion = packageData.version || packageVersion;
  }
} catch (error) {
  // Silently fallback to default version
}

// Enable debug mode if DEBUG environment variable is set
const isDebugMode = process.env.DEBUG?.includes('mcp') || false;

// Helper functions for logging
function log(...args: any[]) {
  if (isDebugMode) {
    console.log('[AI-EXPERT-MCP]', ...args);
  }
}

function logError(...args: any[]) {
  console.error('[AI-EXPERT-MCP-ERROR]', ...args);
}

// Import HTTP server modules
import * as http from 'http';
import { consultWithExpert, generateExpertDocument } from './utils/aiUtils';
import { saveExpertDocument } from './utils/fileUtils';

async function startHttpServer() {
  // Load environment variables from .env file
  dotenv.config();

  // Check if OPENROUTER_API_KEY is set
  if (!process.env.OPENROUTER_API_KEY) {
    console.error('Error: OPENROUTER_API_KEY is required but not set in environment variables');
    console.log('Please set your OpenRouter API key in a .env file or as an environment variable');
    process.exit(1);
  }

  const port = process.env.PORT || 3000;

  const server = http.createServer(async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Only handle POST requests to specific endpoints
    if (req.method === 'POST') {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          // Parse the request body
          const data = JSON.parse(body);

          // Handle different endpoints
          if (req.url === '/mcp/tools/consultExpert') {
            const { expertType, userInput } = data;
            if (!expertType || !userInput) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Missing required parameters: expertType, userInput' }));
              return;
            }

            const response = await consultWithExpert(expertType, userInput);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ response }));
          }
          else if (req.url === '/mcp/tools/generateDocument') {
            const { expertType, projectDescription, saveForTaskMaster } = data;
            if (!expertType || !projectDescription) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Missing required parameters: expertType, projectDescription' }));
              return;
            }

            // Read the template
            const templatePath = `templates/${expertType}-template.md`;
            let template = '';
            try {
              template = fs.readFileSync(path.join(__dirname, '..', templatePath), 'utf8');
            } catch (error) {
              console.log(`Template not found, using default template for ${expertType}`);
              template = `# ${expertType.charAt(0).toUpperCase() + expertType.slice(1)} Document\n\n## Overview\n[Overview goes here]\n\n## Details\n[Details go here]`;
            }

            // Generate the document
            const document = await generateExpertDocument(expertType, template, projectDescription);

            // Save the document
            const filename = `${expertType}_document.md`;
            fs.writeFileSync(path.join(process.cwd(), filename), document, 'utf8');

            // Save for Task Master if requested
            let taskMasterPath = '';
            if (saveForTaskMaster) {
              const isInitial = expertType === 'productManager';
              taskMasterPath = await saveExpertDocument(document, expertType);
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              document,
              filePath: filename,
              taskMasterPath: taskMasterPath || undefined
            }));
          }
          else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
          }
        } catch (error: any) {
          console.error('Error processing request:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `Internal server error: ${error.message || String(error)}` }));
        }
      });
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
  });

  server.listen(port, () => {
    console.log(`HTTP server running at http://localhost:${port}`);
    console.log(`Available endpoints:`);
    console.log(`- POST /mcp/tools/consultExpert`);
    console.log(`- POST /mcp/tools/generateDocument`);
  });

  return server;
}

async function main() {
  let serverInfo;
  try {
    // Display version info
    console.log(`AI Expert Workflow MCP v${packageVersion}`);

    // Check if OPENROUTER_API_KEY is set
    if (!process.env.OPENROUTER_API_KEY) {
      logError('OPENROUTER_API_KEY is required but not set in the environment');
      console.log('\nPlease set your OpenRouter API key using one of these methods:');
      console.log('1. Create a .env file in your project root with:');
      console.log('   OPENROUTER_API_KEY=your_key_here');
      console.log('2. Set it as an environment variable:');
      console.log('   export OPENROUTER_API_KEY=your_key_here');
      console.log('\nYou can get an OpenRouter API key from: https://openrouter.ai/keys');
      process.exit(1);
    }

    // Log which model we're using
    console.log(`Using OpenRouter API with model: ${process.env.OPENROUTER_MODEL || 'default model'}`);

    // Check if we should start HTTP server
    const args = process.argv.slice(2);
    if (args.includes('--http')) {
      console.log('Starting HTTP server mode...');
      await startHttpServer();
      return; // Don't continue with MCP server
    }

    console.log('Starting AI Expert Workflow MCP Server...');

    // Wait for MCP SDK to load before creating the server
    log('Waiting for MCP SDK to be available...');
    const isMcpSdkAvailable = await waitForMcpSdk();

    if (!isMcpSdkAvailable) {
      logError('Failed to load MCP SDK after multiple retries.');
      logError('This may be due to:');
      logError('1. Missing or incompatible MCP SDK installation');
      logError('2. Network issues preventing module loading');
      logError('3. Permissions issues in the node_modules directory');
      process.exit(1);
    }

    // Try to create the server
    log('Creating MCP server...');
    const server = createMCPServer();

    // If server creation failed
    if (!server) {
      logError('Failed to create MCP server. Please check the MCP SDK installation.');
      process.exit(1);
    }

    console.log('Server created, initializing transport...');

    // Use MCP stdio transport
    try {
      log('Importing StdioServerTransport...');
      const stdioModule = await import('@modelcontextprotocol/sdk/server/stdio.js');

      if (!stdioModule || !stdioModule.StdioServerTransport) {
        throw new Error('StdioServerTransport not found in MCP SDK');
      }

      log('Creating transport...');
      const transport = new stdioModule.StdioServerTransport();
      serverInfo = { server, transport };
    } catch (error) {
      logError('Error importing or initializing StdioServerTransport:', error);
      console.log('\nTroubleshooting steps:');
      console.log('1. Check that @modelcontextprotocol/sdk is installed correctly:');
      console.log('   npm install @modelcontextprotocol/sdk@latest');
      console.log('2. Make sure your Node.js version is compatible (v14 or higher)');
      console.log('3. If you installed globally, you may need to reinstall:');
      console.log('   npm uninstall -g ai-expert-workflow-mcp');
      console.log('   npm install -g ai-expert-workflow-mcp');
      process.exit(1);
    }

    // Connect the server to the transport
    if (serverInfo) {
      console.log('Starting server...');
      log('Connecting server to transport...');

      try {
        await serverInfo.server.connect(serverInfo.transport);
        console.log('Server terminated.');
      } catch (error) {
        logError('Error connecting server to transport:', error);
        process.exit(1);
      }
    }
  } catch (error) {
    logError('Unhandled error starting server:', error instanceof Error ? error.message : String(error));
    if (isDebugMode && error instanceof Error && error.stack) {
      logError('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Only run if called directly
if (require.main === module) {
  main().catch(error => {
    logError('Unhandled error in main:', error);
    process.exit(1);
  });
}
