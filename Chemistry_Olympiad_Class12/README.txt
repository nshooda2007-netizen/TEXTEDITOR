================================================================================
        CHEMISTRY OLYMPIAD QUESTION BANK GENERATOR - CLASS 12
                   Complete User Guide
================================================================================

📚 WHAT IS THIS?
--------------------------------------------------------------------------------
This is an easy-to-use system that generates high-quality Chemistry Olympiad
questions for Class 12 students using Anthropic's Claude AI.

✅ Generates 200 questions total:
   - Organic Chemistry: 80 questions
   - Physical Chemistry: 70 questions
   - Inorganic Chemistry: 50 questions

✅ Features:
   - Olympiad-level questions (NSEC/IChO standard)
   - Detailed step-by-step solutions
   - Multiple export formats (JSON, CSV, HTML)
   - Progress tracking
   - Quality checking
   - Search functionality

================================================================================
🚀 QUICK START GUIDE (5 STEPS)
================================================================================

STEP 1: GET AN ANTHROPIC API KEY
--------------------------------------------------------------------------------
1. Go to: https://console.anthropic.com/
2. Sign up or login to your account
3. Click on "API Keys" in the left sidebar
4. Click "Create Key" button
5. Copy your API key (it looks like: sk-ant-api03-...)

⚠️ IMPORTANT: Keep your API key private! Don't share it with anyone.

💰 Cost Information:
   - Generating 10 questions costs approximately $0.10-0.30 USD
   - 200 questions will cost approximately $2-6 USD total
   - You get $5 free credit when you sign up


STEP 2: INSTALL PYTHON (If not already installed)
--------------------------------------------------------------------------------
1. Go to: https://www.python.org/downloads/
2. Download Python 3.8 or higher
3. Run the installer
4. ✅ IMPORTANT: Check the box "Add Python to PATH" during installation
5. Click "Install Now"

To verify installation:
   - Open Command Prompt (Windows) or Terminal (Mac/Linux)
   - Type: python --version
   - You should see: Python 3.x.x


STEP 3: INSTALL REQUIRED LIBRARIES
--------------------------------------------------------------------------------
1. Open Command Prompt (Windows) or Terminal (Mac/Linux)

2. Navigate to this folder:
   Windows: cd path\to\Chemistry_Olympiad_Class12
   Mac/Linux: cd path/to/Chemistry_Olympiad_Class12

3. Install requirements:
   Type: pip install -r requirements.txt
   Press Enter

   This installs the Anthropic library needed for the generator.


STEP 4: RUN THE PROGRAM
--------------------------------------------------------------------------------
1. In the same Command Prompt/Terminal, type:
   python main.py

2. Press Enter

3. The program will start and show you the main menu!


STEP 5: GENERATE YOUR FIRST QUESTIONS
--------------------------------------------------------------------------------
1. When the program starts, it will ask for your API key
2. Paste your Anthropic API key and press Enter
3. The main menu will appear
4. Choose option "1" - Generate Questions by Topic
5. Choose option "4" - Quick Start (Aldehydes & Ketones)
6. Wait 30-60 seconds while questions are generated
7. Done! Your questions are saved automatically


================================================================================
📋 MAIN MENU OPTIONS EXPLAINED
================================================================================

1. GENERATE QUESTIONS BY TOPIC
--------------------------------------------------------------------------------
   - Select a chemistry branch (Organic/Physical/Inorganic)
   - Choose a specific topic
   - Specify how many questions to generate (default: 10)
   - Questions are generated and saved automatically
   - Quality check is performed automatically

2. VIEW PROGRESS
--------------------------------------------------------------------------------
   - See how many questions you've generated
   - Track progress for each branch and topic
   - View difficulty distribution
   - Check completion percentage toward 200 questions

3. EXPORT QUESTIONS
--------------------------------------------------------------------------------
   - Export All: Creates JSON, CSV, and HTML files
   - CSV file: Can be opened in Excel or Google Sheets
   - HTML file: Beautiful webpage you can view in any browser
   - All exports are saved in the "exports" folder

4. SEARCH QUESTIONS
--------------------------------------------------------------------------------
   - Search by concept/keyword (e.g., "oxidation", "mechanism")
   - Search by difficulty (Easy/Medium/Hard)
   - Search by topic
   - Export search results to HTML

5. QUALITY CHECK EXISTING QUESTIONS
--------------------------------------------------------------------------------
   - Analyzes all your generated questions
   - Identifies issues or improvements needed
   - Shows quality score and detailed report
   - Helps ensure Olympiad-level standards

6. SETUP/CHANGE API KEY
--------------------------------------------------------------------------------
   - Update your Anthropic API key
   - Use this if you want to change to a different account


================================================================================
📁 FOLDER STRUCTURE
================================================================================

Chemistry_Olympiad_Class12/
│
├── main.py                          ← Main program (run this!)
├── question_generator.py            ← Generates questions using AI
├── progress_tracker.py              ← Tracks your progress
├── export_module.py                 ← Exports to different formats
├── quality_checker.py               ← Checks question quality
│
├── config.json                      ← Your API key (auto-created)
├── requirements.txt                 ← Required libraries
├── README.txt                       ← This file
│
├── Organic_Chemistry/               ← Organic questions (JSON files)
├── Physical_Chemistry/              ← Physical questions (JSON files)
├── Inorganic_Chemistry/             ← Inorganic questions (JSON files)
│
├── exports/                         ← All export files (CSV, HTML, etc.)
└── progress/                        ← Progress tracking data


================================================================================
🎯 RECOMMENDED WORKFLOW
================================================================================

FOR CREATING A COMPLETE QUESTION BANK:
---------------------------------------
1. Start with important topics first:
   - Aldehydes & Ketones (Organic)
   - Chemical Kinetics (Physical)
   - Coordination Compounds (Inorganic)

2. Generate in batches of 10-15 questions at a time

3. After each batch:
   - Review the quality report
   - If quality score < 60%, regenerate
   - If quality score > 80%, save and continue

4. Every 50 questions, export to HTML to review

5. After completing all 200 questions:
   - Export everything (Option 3 → Option 1)
   - Review the master CSV file
   - Use HTML files for practice


FOR DAILY PRACTICE:
-------------------
1. Use "Search Questions" to find specific topics
2. Export to HTML for clean viewing
3. Print or view on screen
4. Try to solve without looking at solutions
5. Check your answers against the detailed solutions


================================================================================
💡 TIPS FOR BEST RESULTS
================================================================================

✅ DO:
   - Generate 10-15 questions per batch (not too many at once)
   - Review quality reports after each batch
   - Regenerate if quality score is below 60%
   - Export regularly to backup your work
   - Use different difficulty levels for practice

❌ DON'T:
   - Don't try to generate 50+ questions at once (may fail)
   - Don't skip quality checks
   - Don't share your API key
   - Don't delete JSON files in branch folders (they're your data!)


================================================================================
🔧 TROUBLESHOOTING
================================================================================

PROBLEM: "API key not configured" error
SOLUTION: Go to Main Menu → Option 6 → Enter your API key

PROBLEM: "Failed to generate questions" error
SOLUTION:
   - Check your internet connection
   - Verify your API key is correct
   - Make sure you have API credits remaining
   - Try again (the program auto-retries 3 times)

PROBLEM: Python command not found
SOLUTION:
   - Reinstall Python with "Add to PATH" checked
   - Or use: python3 main.py (on Mac/Linux)

PROBLEM: pip not found
SOLUTION:
   - Try: python -m pip install -r requirements.txt
   - Or reinstall Python

PROBLEM: Low quality score consistently
SOLUTION:
   - Try regenerating the batch
   - Check that topic name is spelled correctly
   - Make sure you're connected to internet

PROBLEM: Program closes immediately
SOLUTION:
   - Run from Command Prompt/Terminal (not by double-clicking)
   - Check for error messages


================================================================================
📊 TOPICS COVERED (200 QUESTIONS TOTAL)
================================================================================

ORGANIC CHEMISTRY (80 questions)
--------------------------------
• Alcohols, Phenols & Ethers (15)
• Aldehydes & Ketones (15) ⭐ Start here!
• Carboxylic Acids & Derivatives (15)
• Amines (10)
• Biomolecules (10)
• Polymers (5)
• Reaction Mechanisms (10)

PHYSICAL CHEMISTRY (70 questions)
----------------------------------
• Chemical Kinetics (15) ⭐ Important for Olympiad
• Thermodynamics (15)
• Electrochemistry (15)
• Solutions (15)
• Surface Chemistry (10)

INORGANIC CHEMISTRY (50 questions)
-----------------------------------
• p-Block Elements (20)
• d-Block & f-Block Elements (15)
• Coordination Compounds (15) ⭐ High weightage


================================================================================
📝 QUESTION FORMAT
================================================================================

Each question includes:

1. ❓ Question Text
   - Clear problem statement
   - Proper chemical notation (H₂SO₄, etc.)
   - Multiple-choice format (A, B, C, D)

2. ✅ Correct Answer
   - Marked clearly

3. 📖 Detailed Solution
   - Step-by-step explanation
   - All calculations shown
   - Mechanisms explained (for organic)

4. 🎯 Concepts Tested
   - List of specific concepts

5. ⚠️ Common Mistake
   - What students typically get wrong

6. 🏆 Olympiad Insight
   - Advanced understanding needed
   - Why this is Olympiad-level

7. 📊 Metadata
   - Difficulty level
   - Marks (typically 4)
   - Time estimate


================================================================================
📤 EXPORT FORMATS
================================================================================

1. JSON FILES (.json)
   - Stored in branch folders
   - Raw data format
   - Can be imported into other programs

2. CSV FILE (master_questions.csv)
   - Opens in Excel, Google Sheets
   - All questions in spreadsheet format
   - Easy to sort, filter, analyze

3. HTML FILE (.html)
   - Beautiful webpage format
   - Opens in any web browser
   - Color-coded by difficulty
   - Perfect for studying


================================================================================
🎓 STUDY TIPS
================================================================================

1. Use difficulty levels strategically:
   - Easy: Build confidence and foundation
   - Medium: Regular practice (50% of questions)
   - Hard: Challenge yourself (Olympiad level)

2. Review concepts tested:
   - Track which concepts you struggle with
   - Generate more questions on weak areas
   - Use search to find similar questions

3. Time yourself:
   - Use the time estimates provided
   - Practice under Olympiad conditions
   - Aim to solve within the time limit

4. Study the solutions:
   - Don't just check answers
   - Understand the complete solution
   - Learn from common mistakes

5. Focus on Olympiad insights:
   - These separate good students from excellent ones
   - Understand the advanced concepts
   - Apply to similar problems


================================================================================
⚠️ IMPORTANT NOTES
================================================================================

• Internet Required: The program needs internet to generate questions

• API Costs: Each generation uses API credits (costs money)
  - Monitor your usage at: https://console.anthropic.com/
  - You can set usage limits in your Anthropic account

• Data Safety: All questions are saved locally on your computer
  - Backup the entire folder regularly
  - JSON files contain all your generated questions

• Quality Over Quantity:
  - Don't rush to generate all 200 questions
  - Quality check each batch
  - It's better to have 100 excellent questions than 200 mediocre ones


================================================================================
❓ FREQUENTLY ASKED QUESTIONS
================================================================================

Q: How much does it cost to generate all 200 questions?
A: Approximately $2-6 USD depending on question complexity. You get $5 free
   credit when you sign up for Anthropic API.

Q: Can I edit the generated questions?
A: Yes! Edit the JSON files in a text editor, or export to CSV and edit in
   Excel. Questions are your data to use freely.

Q: Are questions repeated?
A: No, each question is uniquely generated. The AI creates new questions
   each time based on the topic and requirements.

Q: Can I generate more than 200 questions?
A: Yes! The 200 is just a target. You can generate as many as you want.

Q: What if I lose my progress?
A: Progress is saved in progress/progress.json. As long as you don't delete
   this file and the JSON files in branch folders, your progress is safe.

Q: Can multiple people use this?
A: Yes, but each person needs their own API key. Don't share API keys.

Q: How do I backup my questions?
A: Copy the entire Chemistry_Olympiad_Class12 folder to a USB drive or
   cloud storage (Google Drive, Dropbox, etc.)

Q: Can I use this offline?
A: No, internet is required to generate questions. But you can view/export
   existing questions offline.

Q: What if a question seems wrong?
A: Use the quality checker and regenerate if needed. AI can make mistakes,
   always verify important content.


================================================================================
📞 SUPPORT & FEEDBACK
================================================================================

For Issues:
   - Check the Troubleshooting section above
   - Read error messages carefully
   - Make sure all steps were followed

For Anthropic API Issues:
   - Visit: https://docs.anthropic.com/
   - Check: https://status.anthropic.com/

For Python Issues:
   - Visit: https://www.python.org/doc/


================================================================================
✅ FINAL CHECKLIST
================================================================================

Before you start, make sure you have:

□ Python 3.8 or higher installed
□ Anthropic API key ready
□ Internet connection active
□ Installed required libraries (pip install -r requirements.txt)
□ Opened Command Prompt/Terminal in the correct folder
□ Run: python main.py


================================================================================
🎯 READY TO START?
================================================================================

1. Open Command Prompt or Terminal
2. Navigate to this folder
3. Type: python main.py
4. Press Enter
5. Follow the on-screen instructions

Good luck with your Chemistry Olympiad preparation! 🏆

================================================================================
