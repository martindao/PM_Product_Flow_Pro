#!/bin/bash

# Build the project first
echo "Building the project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Build failed! Aborting tests."
  exit 1
fi

# Run essential tests
echo "Running essential tests..."

# Run MCP-only test
echo -e "\n=== Running MCP Server Test ==="
npm run test:mcp-only

# Store MCP test result
MCP_RESULT=$?

# Run OpenRouter direct test
echo -e "\n=== Running OpenRouter API Test ==="
npm run test:openrouter-direct

# Store OpenRouter test result
API_RESULT=$?

# Report overall results
echo -e "\n=== Overall Test Results ==="
echo "MCP Server Test: $([ $MCP_RESULT -eq 0 ] && echo 'PASSED' || echo 'FAILED')"
echo "OpenRouter API Test: $([ $API_RESULT -eq 0 ] && echo 'PASSED' || echo 'FAILED')"

# Exit with appropriate code
if [ $MCP_RESULT -eq 0 ] && [ $API_RESULT -eq 0 ]; then
  echo -e "\nAll essential tests passed successfully!"
  exit 0
else
  echo -e "\nSome tests failed. Please check the logs above for details."
  exit 1
fi
