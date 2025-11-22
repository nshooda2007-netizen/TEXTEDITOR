@echo off
REM Chemistry Olympiad Question Generator - Windows Launcher
REM Double-click this file to run the program

echo ========================================
echo Chemistry Olympiad Question Generator
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo.
    echo Please install Python from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    echo.
    pause
    exit /b 1
)

echo Starting the application...
echo.

REM Run the main program
python main.py

REM If there was an error, pause to see it
if errorlevel 1 (
    echo.
    echo An error occurred. Please read the error message above.
    pause
)
