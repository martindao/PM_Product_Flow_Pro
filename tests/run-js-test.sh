#!/bin/bash

# Run the JavaScript test
echo "Running JavaScript test..."
node tests/test-openrouter.js

# Check the exit code
if [ $? -eq 0 ]; then
  echo "JavaScript test completed successfully!"
else
  echo "JavaScript test failed!"
  exit 1
fi

# [2025-03-03] (Workflow) schedule note: Harden OpenRouter integration for Workflow

# [2025-03-19] (MCP) schedule note: Improve Task Master export for MCP

# [2025-04-30] (OpenRouter) schedule note: Improve Task Master export for OpenRouter

# [2025-06-16] (MCP) schedule note: Document expert workflow for MCP

# [2025-07-29] (Workflow) schedule note: Harden OpenRouter integration for Workflow

# [2025-09-11] (Workflow) schedule note: Improve Task Master export for Workflow
