#!/bin/bash

# Build the project first
echo "Building the project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Build failed! Aborting tests."
  exit 1
fi

# Run both tests
echo "Running all tests..."

# Run JavaScript test
echo -e "\n=== Running JavaScript Test ==="
./tests/run-js-test.sh

# Store JavaScript test result
JS_RESULT=$?

# Run TypeScript test
echo -e "\n=== Running TypeScript Test ==="
./tests/run-ts-test.sh

# Store TypeScript test result
TS_RESULT=$?

# Report overall results
echo -e "\n=== Overall Test Results ==="
echo "JavaScript Test: $([ $JS_RESULT -eq 0 ] && echo 'PASSED' || echo 'FAILED')"
echo "TypeScript Test: $([ $TS_RESULT -eq 0 ] && echo 'PASSED' || echo 'FAILED')"

# Exit with appropriate code
if [ $JS_RESULT -eq 0 ] && [ $TS_RESULT -eq 0 ]; then
  echo -e "\nAll tests passed successfully!"
  exit 0
else
  echo -e "\nSome tests failed. Please check the logs above for details."
  exit 1
fi

# [2025-02-27] (Expert) schedule note: Harden OpenRouter integration for Expert

# [2025-04-30] (MCP) schedule note: Refine MCP prompt flow for MCP

# [2025-06-16] (MCP) schedule note: Document expert workflow for MCP

# [2025-07-28] (MCP) schedule note: Refine MCP prompt flow for MCP

# [2025-09-10] (Workflow) schedule note: Improve Task Master export for Workflow

# [2025-10-22] (Workflow) schedule note: Document expert workflow for Workflow
