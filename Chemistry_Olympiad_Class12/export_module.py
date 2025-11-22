"""
Export Module
Handles exporting questions to various formats: JSON, CSV, HTML, PDF
"""

import json
import csv
import os
from datetime import datetime
from typing import List, Dict
import glob

class ExportModule:
    def __init__(self, exports_dir: str = "exports"):
        """Initialize export module"""
        self.exports_dir = exports_dir

    def export_to_json(self, data: Dict, filename: str) -> str:
        """Export questions to JSON file"""
        filepath = os.path.join(self.exports_dir, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return filepath

    def export_to_csv(self, questions: List[Dict], filename: str = "master_questions.csv") -> str:
        """Export all questions to a master CSV file"""
        filepath = os.path.join(self.exports_dir, filename)

        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)

            # Write header
            writer.writerow([
                'ID', 'Branch', 'Topic', 'Question', 'Option A', 'Option B',
                'Option C', 'Option D', 'Correct Answer', 'Difficulty',
                'Solution', 'Concepts Tested', 'Common Mistake',
                'Olympiad Insight', 'Marks', 'Time Estimate'
            ])

            # Write questions
            for q in questions:
                writer.writerow([
                    q.get('id', ''),
                    q.get('branch', ''),
                    q.get('topic', ''),
                    q.get('question', ''),
                    q.get('options', {}).get('A', ''),
                    q.get('options', {}).get('B', ''),
                    q.get('options', {}).get('C', ''),
                    q.get('options', {}).get('D', ''),
                    q.get('correct_answer', ''),
                    q.get('difficulty', ''),
                    q.get('solution', ''),
                    ', '.join(q.get('concepts_tested', [])),
                    q.get('common_mistake', ''),
                    q.get('olympiad_insight', ''),
                    q.get('marks', 4),
                    q.get('time_estimate', '')
                ])

        return filepath

    def export_to_html(self, questions: List[Dict], title: str = "Chemistry Olympiad Questions") -> str:
        """Export questions to HTML with proper formatting"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"questions_{timestamp}.html"
        filepath = os.path.join(self.exports_dir, filename)

        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }}
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }}
        .question-card {{
            background: white;
            padding: 25px;
            margin-bottom: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .question-header {{
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
        }}
        .question-id {{
            font-size: 0.9em;
            color: #666;
        }}
        .difficulty {{
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: bold;
        }}
        .difficulty.Easy {{ background-color: #d4edda; color: #155724; }}
        .difficulty.Medium {{ background-color: #fff3cd; color: #856404; }}
        .difficulty.Hard {{ background-color: #f8d7da; color: #721c24; }}
        .question-text {{
            font-size: 1.1em;
            margin: 20px 0;
            line-height: 1.6;
        }}
        .options {{
            margin: 20px 0;
        }}
        .option {{
            padding: 12px;
            margin: 8px 0;
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            border-radius: 4px;
        }}
        .option.correct {{
            background-color: #d4edda;
            border-left-color: #28a745;
        }}
        .solution-section {{
            margin-top: 20px;
            padding: 15px;
            background-color: #e7f3ff;
            border-radius: 5px;
        }}
        .solution-title {{
            font-weight: bold;
            color: #0066cc;
            margin-bottom: 10px;
        }}
        .concepts {{
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 15px 0;
        }}
        .concept-tag {{
            background-color: #667eea;
            color: white;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 0.85em;
        }}
        .insight-box {{
            background-color: #fff3cd;
            padding: 15px;
            border-left: 4px solid #ffc107;
            margin: 15px 0;
            border-radius: 4px;
        }}
        .mistake-box {{
            background-color: #f8d7da;
            padding: 15px;
            border-left: 4px solid #dc3545;
            margin: 15px 0;
            border-radius: 4px;
        }}
        .meta-info {{
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            font-size: 0.9em;
            color: #666;
        }}
        .stats {{
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }}
        .stat-item {{
            text-align: center;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }}
        .stat-number {{
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }}
        .stat-label {{
            color: #666;
            margin-top: 5px;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>{title}</h1>
        <p>Generated on {datetime.now().strftime("%B %d, %Y at %I:%M %p")}</p>
    </div>
"""

        # Add statistics
        total = len(questions)
        difficulty_counts = {"Easy": 0, "Medium": 0, "Hard": 0}
        branches = {}

        for q in questions:
            diff = q.get('difficulty', 'Medium')
            if diff in difficulty_counts:
                difficulty_counts[diff] += 1

            branch = q.get('branch', 'Unknown')
            branches[branch] = branches.get(branch, 0) + 1

        html_content += f"""
    <div class="stats">
        <h2>Question Bank Statistics</h2>
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-number">{total}</div>
                <div class="stat-label">Total Questions</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{difficulty_counts['Easy']}</div>
                <div class="stat-label">Easy</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{difficulty_counts['Medium']}</div>
                <div class="stat-label">Medium</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{difficulty_counts['Hard']}</div>
                <div class="stat-label">Hard</div>
            </div>
        </div>
    </div>
"""

        # Add questions
        for idx, q in enumerate(questions, 1):
            question_html = f"""
    <div class="question-card">
        <div class="question-header">
            <div class="question-id">Question #{idx} | ID: {q.get('id', 'N/A')}</div>
            <div class="difficulty {q.get('difficulty', 'Medium')}">{q.get('difficulty', 'Medium')}</div>
        </div>

        <div class="question-text">
            <strong>Q.</strong> {q.get('question', '')}
        </div>

        <div class="options">
"""
            correct = q.get('correct_answer', '')
            for option_key in ['A', 'B', 'C', 'D']:
                option_text = q.get('options', {}).get(option_key, '')
                is_correct = option_key == correct
                correct_class = ' correct' if is_correct else ''
                checkmark = ' ✓' if is_correct else ''
                question_html += f"""            <div class="option{correct_class}">
                <strong>{option_key}.</strong> {option_text}{checkmark}
            </div>
"""

            question_html += f"""        </div>

        <div class="solution-section">
            <div class="solution-title">📝 Solution:</div>
            <div>{q.get('solution', 'No solution provided.')}</div>
        </div>
"""

            if q.get('concepts_tested'):
                concepts_html = ''.join([f'<span class="concept-tag">{c}</span>' for c in q['concepts_tested']])
                question_html += f"""
        <div class="concepts">
            <strong>Concepts Tested:</strong> {concepts_html}
        </div>
"""

            if q.get('olympiad_insight'):
                question_html += f"""
        <div class="insight-box">
            <strong>🏆 Olympiad Insight:</strong> {q['olympiad_insight']}
        </div>
"""

            if q.get('common_mistake'):
                question_html += f"""
        <div class="mistake-box">
            <strong>⚠️ Common Mistake:</strong> {q['common_mistake']}
        </div>
"""

            question_html += f"""
        <div class="meta-info">
            <div><strong>Topic:</strong> {q.get('topic', 'N/A')}</div>
            <div><strong>Marks:</strong> {q.get('marks', 4)}</div>
            <div><strong>Time:</strong> {q.get('time_estimate', 'N/A')}</div>
        </div>
    </div>
"""
            html_content += question_html

        html_content += """
</body>
</html>
"""

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html_content)

        return filepath

    def collect_all_questions(self, branch_dirs: List[str]) -> List[Dict]:
        """Collect all questions from JSON files across all branches"""
        all_questions = []

        for branch in branch_dirs:
            # Find all JSON files in branch directory
            json_files = glob.glob(os.path.join(branch, "*.json"))

            for json_file in json_files:
                try:
                    with open(json_file, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        questions = data.get('questions', [])

                        # Add branch and topic info to each question
                        for q in questions:
                            if 'branch' not in q:
                                q['branch'] = data.get('branch', os.path.basename(branch))
                            if 'topic' not in q:
                                q['topic'] = data.get('topic', 'Unknown')

                        all_questions.extend(questions)
                except Exception as e:
                    print(f"  ⚠️ Error reading {json_file}: {e}")

        return all_questions

    def export_all_formats(self):
        """Export all questions in all formats"""
        print("\n📦 Exporting all questions in multiple formats...")

        # Collect all questions
        branches = ['Organic_Chemistry', 'Physical_Chemistry', 'Inorganic_Chemistry']
        all_questions = self.collect_all_questions(branches)

        if not all_questions:
            print("  ⚠️ No questions found to export.")
            return

        print(f"  ✓ Found {len(all_questions)} total questions")

        # Export to CSV
        print("  📊 Exporting to CSV...")
        csv_file = self.export_to_csv(all_questions)
        print(f"  ✓ CSV saved: {csv_file}")

        # Export to HTML
        print("  🌐 Exporting to HTML...")
        html_file = self.export_to_html(all_questions)
        print(f"  ✓ HTML saved: {html_file}")

        # Export master JSON
        print("  📄 Exporting master JSON...")
        master_data = {
            "total_questions": len(all_questions),
            "export_date": datetime.now().isoformat(),
            "questions": all_questions
        }
        json_file = self.export_to_json(master_data, "master_questions.json")
        print(f"  ✓ JSON saved: {json_file}")

        print("\n✅ All exports completed successfully!")
        print(f"   Check the '{self.exports_dir}' folder for all files.")
