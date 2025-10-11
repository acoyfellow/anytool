#!/bin/bash

# Anytool Test Runner
# Provides easy commands to test the example tools

set -e

case "$1" in
    "all" | "")
        echo "🚀 Running full test suite..."
        cd "$(dirname "$0")/.." && bun run test
        ;;
    "list")
        echo "📋 Listing all examples..."
        cd "$(dirname "$0")/.." && bun run test:list
        ;;
    "single")
        if [ -z "$2" ]; then
            echo "❌ Error: Please provide an example index"
            echo "Usage: ./tests/run-tests.sh single <index>"
            echo "Use './tests/run-tests.sh list' to see available indices"
            exit 1
        fi
        echo "🎯 Running single test for example $2..."
        cd "$(dirname "$0")/.." && bun run test:single "$2"
        ;;
    "report")
        echo "📊 Generating test report..."
        cd "$(dirname "$0")/.." && bun run test > tests/test-results.log 2>&1
        echo "Results saved to tests/test-results.log"
        echo ""
        echo "Quick summary:"
        grep -E "(SUCCESS|FAILED|SUMMARY)" tests/test-results.log | tail -10
        ;;
    "help" | "-h" | "--help")
        echo "Anytool Test Runner"
        echo ""
        echo "Commands:"
        echo "  ./tests/run-tests.sh all       # Run all tests (default)"
        echo "  ./tests/run-tests.sh list      # List all examples with indices"
        echo "  ./tests/run-tests.sh single N  # Run test for example N"
        echo "  ./tests/run-tests.sh report    # Run tests and save results to file"
        echo "  ./tests/run-tests.sh help      # Show this help"
        echo ""
        echo "Examples:"
        echo "  ./tests/run-tests.sh           # Run all tests"
        echo "  ./tests/run-tests.sh single 2  # Test QR code generator"
        echo "  ./tests/run-tests.sh report    # Run tests and save to log"
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "Use './run-tests.sh help' for usage information"
        exit 1
        ;;
esac