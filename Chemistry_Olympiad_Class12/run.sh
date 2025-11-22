#!/bin/bash
# Chemistry Olympiad Question Generator - Mac/Linux Launcher
# Run this file to start the program

echo "========================================"
echo "Chemistry Olympiad Question Generator"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python is not installed"
    echo ""
    echo "Please install Python from https://www.python.org/downloads/"
    echo "Or use your package manager:"
    echo "  - Ubuntu/Debian: sudo apt-get install python3"
    echo "  - macOS: brew install python3"
    echo ""
    exit 1
fi

echo "Starting the application..."
echo ""

# Run the main program
python3 main.py

# Check exit code
if [ $? -ne 0 ]; then
    echo ""
    echo "An error occurred. Please read the error message above."
    read -p "Press Enter to continue..."
fi
