#!/usr/bin/env python3
"""
Chemistry Olympiad Question Bank Generator
Main Application - Class 12

Easy-to-use system for generating Olympiad-level chemistry questions
using Anthropic's Claude API
"""

import os
import sys
import json
import time
from datetime import datetime

from question_generator import QuestionGenerator
from progress_tracker import ProgressTracker
from export_module import ExportModule
from quality_checker import QualityChecker

# Topic definitions
TOPICS = {
    "Organic_Chemistry": {
        "Alcohols, Phenols & Ethers": 15,
        "Aldehydes & Ketones": 15,
        "Carboxylic Acids & Derivatives": 15,
        "Amines": 10,
        "Biomolecules": 10,
        "Polymers": 5,
        "Reaction Mechanisms": 10
    },
    "Physical_Chemistry": {
        "Chemical Kinetics": 15,
        "Thermodynamics": 15,
        "Electrochemistry": 15,
        "Solutions": 15,
        "Surface Chemistry": 10
    },
    "Inorganic_Chemistry": {
        "p-Block Elements": 20,
        "d-Block & f-Block Elements": 15,
        "Coordination Compounds": 15
    }
}

class ChemistryOlympiadApp:
    def __init__(self):
        """Initialize the application"""
        self.api_key = None
        self.generator = None
        self.progress = ProgressTracker()
        self.exporter = ExportModule()
        self.quality_checker = QualityChecker()

        # Try to load API key from config
        self._load_api_key()

    def _load_api_key(self):
        """Load API key from config file"""
        config_file = "config.json"
        if os.path.exists(config_file):
            try:
                with open(config_file, 'r') as f:
                    config = json.load(f)
                    self.api_key = config.get('anthropic_api_key')
                    if self.api_key:
                        self.generator = QuestionGenerator(self.api_key)
            except:
                pass

    def _save_api_key(self, api_key: str):
        """Save API key to config file"""
        config = {'anthropic_api_key': api_key}
        with open('config.json', 'w') as f:
            json.dump(config, f, indent=2)

    def setup_api_key(self):
        """Setup or change API key"""
        print("\n" + "="*60)
        print("           ANTHROPIC API KEY SETUP")
        print("="*60)
        print("\nTo use this generator, you need an Anthropic API key.")
        print("Get your API key from: https://console.anthropic.com/")
        print("\nYour API key will be saved locally in config.json")

        api_key = input("\nEnter your Anthropic API key: ").strip()

        if api_key:
            self.api_key = api_key
            self.generator = QuestionGenerator(api_key)
            self._save_api_key(api_key)
            print("\n✅ API key saved successfully!")
            time.sleep(1)
        else:
            print("\n❌ No API key entered.")
            time.sleep(1)

    def generate_questions_menu(self):
        """Menu for generating questions"""
        while True:
            self.clear_screen()
            print("\n" + "="*60)
            print("           GENERATE QUESTIONS")
            print("="*60)

            print("\nSelect Chemistry Branch:")
            print("  1. Organic Chemistry (80 questions total)")
            print("  2. Physical Chemistry (70 questions total)")
            print("  3. Inorganic Chemistry (50 questions total)")
            print("  4. Quick Start - Aldehydes & Ketones (Recommended)")
            print("  0. Back to Main Menu")

            choice = input("\nEnter your choice: ").strip()

            if choice == '0':
                break
            elif choice == '1':
                self.generate_by_branch("Organic_Chemistry")
            elif choice == '2':
                self.generate_by_branch("Physical_Chemistry")
            elif choice == '3':
                self.generate_by_branch("Inorganic_Chemistry")
            elif choice == '4':
                # Quick start with Aldehydes & Ketones
                topic_info = {
                    'branch': 'Organic_Chemistry',
                    'topic': 'Aldehydes & Ketones',
                    'olympiad_level': 'NSEC'
                }
                self.generate_batch(topic_info, 10)
                input("\nPress Enter to continue...")
            else:
                print("❌ Invalid choice!")
                time.sleep(1)

    def generate_by_branch(self, branch: str):
        """Generate questions for a specific branch"""
        while True:
            self.clear_screen()
            print("\n" + "="*60)
            print(f"       {branch.replace('_', ' ').upper()}")
            print("="*60)

            topics = TOPICS.get(branch, {})
            print("\nAvailable Topics:")

            topic_list = list(topics.items())
            for idx, (topic, target) in enumerate(topic_list, 1):
                current = self.progress.get_topic_count(branch, topic)
                status = "✓" if current >= target else " "
                print(f"  {status} {idx}. {topic} ({current}/{target} questions)")

            print("\n  0. Back")

            choice = input("\nSelect topic number: ").strip()

            if choice == '0':
                break

            try:
                topic_idx = int(choice) - 1
                if 0 <= topic_idx < len(topic_list):
                    topic_name = topic_list[topic_idx][0]

                    # Ask for batch size
                    print(f"\nGenerating questions for: {topic_name}")
                    batch_size = input("Number of questions to generate (default 10): ").strip()
                    batch_size = int(batch_size) if batch_size else 10

                    topic_info = {
                        'branch': branch,
                        'topic': topic_name,
                        'olympiad_level': 'NSEC'
                    }

                    self.generate_batch(topic_info, batch_size)
                    input("\nPress Enter to continue...")
                else:
                    print("❌ Invalid topic number!")
                    time.sleep(1)
            except ValueError:
                print("❌ Please enter a valid number!")
                time.sleep(1)

    def generate_batch(self, topic_info: Dict, batch_size: int = 10):
        """Generate a batch of questions"""
        if not self.generator:
            print("\n❌ API key not configured!")
            print("   Please setup your API key first (Option 6 in main menu)")
            return

        print("\n" + "="*60)
        print(f"  Generating {batch_size} questions for: {topic_info['topic']}")
        print("="*60)

        # Show progress animation
        print("\n  This may take 30-60 seconds...")
        print("  ⏳ ", end="", flush=True)

        # Generate questions with retry
        result = self.generator.retry_generate(topic_info, batch_size, max_retries=3)

        if not result:
            print("\n\n❌ Failed to generate questions after multiple attempts.")
            print("   Please check your API key and internet connection.")
            return

        questions = result.get('questions', [])
        print(f"\n\n  ✅ Generated {len(questions)} questions successfully!")

        # Run quality check
        print("\n  🔍 Running quality check...")
        quality_report = self.quality_checker.check_batch(questions)

        if quality_report['quality_score'] < 60:
            print(f"\n  ⚠️ Quality score: {quality_report['quality_score']:.1f}% (Low)")
            print("  Some questions may need improvement.")
        else:
            print(f"\n  ✓ Quality score: {quality_report['quality_score']:.1f}%")

        # Show difficulty distribution
        self.quality_checker.print_difficulty_analysis(questions)

        # Ask if user wants to see detailed quality report
        show_details = input("\n  View detailed quality report? (y/n): ").strip().lower()
        if show_details == 'y':
            self.quality_checker.print_quality_report(quality_report)

        # Save questions
        branch = topic_info['branch']
        topic = topic_info['topic']

        # Create filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_topic = topic.replace(' ', '_').replace('&', 'and')
        filename = f"{safe_topic}_{timestamp}.json"
        filepath = os.path.join(branch, filename)

        # Save to JSON
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)

        print(f"\n  💾 Saved to: {filepath}")

        # Update progress
        self.progress.add_questions(branch, topic, questions)
        print(f"  📊 Progress updated!")

        # Offer to regenerate if quality is low
        if quality_report['quality_score'] < 60:
            regenerate = input("\n  Quality is low. Regenerate this batch? (y/n): ").strip().lower()
            if regenerate == 'y':
                print("\n  🔄 Regenerating...")
                self.generate_batch(topic_info, batch_size)

    def view_progress(self):
        """View current progress"""
        self.clear_screen()
        print(self.progress.get_progress_summary())
        input("\nPress Enter to continue...")

    def export_questions(self):
        """Export questions in various formats"""
        self.clear_screen()
        print("\n" + "="*60)
        print("           EXPORT QUESTIONS")
        print("="*60)

        print("\nExport Options:")
        print("  1. Export All (JSON + CSV + HTML)")
        print("  2. Export to CSV only")
        print("  3. Export to HTML only")
        print("  0. Back")

        choice = input("\nEnter your choice: ").strip()

        if choice == '0':
            return
        elif choice == '1':
            self.exporter.export_all_formats()
        elif choice == '2':
            branches = ['Organic_Chemistry', 'Physical_Chemistry', 'Inorganic_Chemistry']
            questions = self.exporter.collect_all_questions(branches)
            if questions:
                filepath = self.exporter.export_to_csv(questions)
                print(f"\n✅ CSV exported to: {filepath}")
            else:
                print("\n❌ No questions found to export!")
        elif choice == '3':
            branches = ['Organic_Chemistry', 'Physical_Chemistry', 'Inorganic_Chemistry']
            questions = self.exporter.collect_all_questions(branches)
            if questions:
                filepath = self.exporter.export_to_html(questions)
                print(f"\n✅ HTML exported to: {filepath}")
            else:
                print("\n❌ No questions found to export!")
        else:
            print("❌ Invalid choice!")
            time.sleep(1)
            return

        input("\nPress Enter to continue...")

    def search_questions(self):
        """Search questions by concept or difficulty"""
        self.clear_screen()
        print("\n" + "="*60)
        print("           SEARCH QUESTIONS")
        print("="*60)

        # Collect all questions
        branches = ['Organic_Chemistry', 'Physical_Chemistry', 'Inorganic_Chemistry']
        all_questions = self.exporter.collect_all_questions(branches)

        if not all_questions:
            print("\n❌ No questions found!")
            input("\nPress Enter to continue...")
            return

        print(f"\nSearching through {len(all_questions)} questions...")
        print("\nSearch by:")
        print("  1. Concept/Keyword")
        print("  2. Difficulty")
        print("  3. Topic")

        choice = input("\nEnter your choice: ").strip()

        results = []

        if choice == '1':
            keyword = input("Enter concept/keyword to search: ").strip().lower()
            for q in all_questions:
                # Search in concepts, question text, and solution
                concepts = ' '.join(q.get('concepts_tested', [])).lower()
                question_text = q.get('question', '').lower()
                solution = q.get('solution', '').lower()

                if keyword in concepts or keyword in question_text or keyword in solution:
                    results.append(q)

        elif choice == '2':
            difficulty = input("Enter difficulty (Easy/Medium/Hard): ").strip()
            results = [q for q in all_questions if q.get('difficulty') == difficulty]

        elif choice == '3':
            topic = input("Enter topic name: ").strip()
            results = [q for q in all_questions if topic.lower() in q.get('topic', '').lower()]

        # Display results
        if results:
            print(f"\n✅ Found {len(results)} matching questions")

            # Show first 5
            for idx, q in enumerate(results[:5], 1):
                print(f"\n{idx}. {q.get('question', '')[:100]}...")
                print(f"   Topic: {q.get('topic', 'N/A')} | Difficulty: {q.get('difficulty', 'N/A')}")

            if len(results) > 5:
                print(f"\n... and {len(results) - 5} more")

            # Offer to export search results
            export = input("\nExport search results to HTML? (y/n): ").strip().lower()
            if export == 'y':
                filepath = self.exporter.export_to_html(results, f"Search Results - {len(results)} questions")
                print(f"\n✅ Exported to: {filepath}")
        else:
            print("\n❌ No matching questions found!")

        input("\nPress Enter to continue...")

    def clear_screen(self):
        """Clear the terminal screen"""
        os.system('clear' if os.name != 'nt' else 'cls')

    def show_main_menu(self):
        """Display main menu"""
        self.clear_screen()
        print("\n" + "="*60)
        print("     CHEMISTRY OLYMPIAD QUESTION BANK GENERATOR")
        print("                  CLASS 12")
        print("="*60)

        # Show quick stats
        total = self.progress.progress_data['total_questions']
        print(f"\n  📊 Total Questions Generated: {total}/200")

        if self.api_key:
            print("  🔑 API Key: Configured ✓")
        else:
            print("  🔑 API Key: Not configured ❌")

        print("\n" + "-"*60)
        print("MAIN MENU:")
        print("-"*60)
        print("  1. Generate Questions by Topic")
        print("  2. View Progress")
        print("  3. Export Questions (JSON/CSV/HTML)")
        print("  4. Search Questions")
        print("  5. Quality Check Existing Questions")
        print("  6. Setup/Change API Key")
        print("  0. Exit")
        print("-"*60)

    def quality_check_existing(self):
        """Run quality check on existing questions"""
        self.clear_screen()
        print("\n" + "="*60)
        print("           QUALITY CHECK")
        print("="*60)

        branches = ['Organic_Chemistry', 'Physical_Chemistry', 'Inorganic_Chemistry']
        all_questions = self.exporter.collect_all_questions(branches)

        if not all_questions:
            print("\n❌ No questions found!")
            input("\nPress Enter to continue...")
            return

        print(f"\n🔍 Analyzing {len(all_questions)} questions...")

        report = self.quality_checker.check_batch(all_questions)
        self.quality_checker.print_quality_report(report)

        input("\nPress Enter to continue...")

    def run(self):
        """Main application loop"""
        # Show welcome message
        if not self.api_key:
            self.clear_screen()
            print("\n" + "="*60)
            print("     WELCOME TO CHEMISTRY OLYMPIAD GENERATOR")
            print("="*60)
            print("\n⚠️  API Key not configured!")
            print("\nPlease setup your Anthropic API key to get started.")
            input("\nPress Enter to continue to setup...")
            self.setup_api_key()

        while True:
            self.show_main_menu()

            choice = input("\nEnter your choice: ").strip()

            if choice == '0':
                print("\n👋 Thank you for using Chemistry Olympiad Generator!")
                print("   Happy studying! 📚\n")
                break
            elif choice == '1':
                self.generate_questions_menu()
            elif choice == '2':
                self.view_progress()
            elif choice == '3':
                self.export_questions()
            elif choice == '4':
                self.search_questions()
            elif choice == '5':
                self.quality_check_existing()
            elif choice == '6':
                self.setup_api_key()
            else:
                print("\n❌ Invalid choice! Please try again.")
                time.sleep(1)

if __name__ == "__main__":
    app = ChemistryOlympiadApp()
    app.run()
