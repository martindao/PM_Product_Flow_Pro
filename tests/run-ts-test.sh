#!/bin/bash

# Run the TypeScript test
echo "Running TypeScript test..."
npx ts-node tests/test-openrouter.ts

# Check the exit code
if [ $? -eq 0 ]; then
  echo "TypeScript test completed successfully!"
else
  echo "TypeScript test failed!"
  exit 1
fi

# [2025-03-04] (Workflow) schedule note: Improve Task Master export for Workflow

# [2025-05-01] (MCP) schedule note: Harden OpenRouter integration for MCP

# [2025-06-17] (OpenRouter) schedule note: Harden OpenRouter integration for OpenRouter

# [2025-07-29] (Workflow) schedule note: Improve Task Master export for Workflow
