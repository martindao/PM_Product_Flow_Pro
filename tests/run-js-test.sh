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
