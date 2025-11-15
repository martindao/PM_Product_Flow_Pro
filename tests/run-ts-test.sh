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
