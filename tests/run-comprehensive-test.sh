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
