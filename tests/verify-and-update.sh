#!/bin/bash

# Script to verify OpenRouter API key and update MCP config in one step

# Check if API key is provided
if [ -z "$1" ]; then
  echo "Error: API key is required as a command-line argument"
  echo "Usage: ./verify-and-update.sh YOUR_API_KEY"
  exit 1
fi

API_KEY=$1

# Verify the API key
echo "Step 1: Verifying OpenRouter API key..."
node tests/verify-openrouter.js $API_KEY

# Check if verification was successful
if [ $? -ne 0 ]; then
  echo "Verification failed! Aborting configuration update."
  exit 1
fi

# Update the MCP config
echo -e "\nStep 2: Updating MCP configuration..."
node tests/update-mcp-config.js $API_KEY

# Check if update was successful
if [ $? -ne 0 ]; then
  echo "Configuration update failed!"
  exit 1
fi

echo -e "\nAll steps completed successfully!"
echo "Your OpenRouter API key has been verified and the MCP configuration has been updated."
echo "Using model: tngtech/deepseek-r1t-chimera:free"
echo "You can now run the MCP server with: npm start"
