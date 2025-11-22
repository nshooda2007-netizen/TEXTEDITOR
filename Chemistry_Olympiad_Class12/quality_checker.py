"""
Quality Checker Module
Validates question quality and flags issues
"""

from typing import List, Dict, Tuple

class QualityChecker:
    def __init__(self):
        """Initialize quality checker"""
        self.min_question_length = 50
        self.min_solution_length = 100
        self.min_options = 4

    def check_question(self, question: Dict) -> Tuple[bool, List[str]]:
        """
        Check a single question for quality issues

        Returns:
            (is_valid, list_of_issues)
        """
        issues = []

        # Check question text
        q_text = question.get('question', '')
        if not q_text:
            issues.append("❌ Missing question text")
        elif len(q_text) < self.min_question_length:
            issues.append(f"⚠️ Question too short ({len(q_text)} chars, recommend 50+)")

        # Check options
        options = question.get('options', {})
        if not isinstance(options, dict):
            issues.append("❌ Options not in correct format")
        elif len(options) < self.min_options:
            issues.append(f"❌ Insufficient options ({len(options)}, need 4)")
        else:
            # Check each option has content
            for key in ['A', 'B', 'C', 'D']:
                if key not in options or not options[key]:
                    issues.append(f"❌ Missing option {key}")

        # Check correct answer
        correct = question.get('correct_answer', '')
        if not correct:
            issues.append("❌ Missing correct answer")
        elif correct not in ['A', 'B', 'C', 'D']:
            issues.append(f"❌ Invalid correct answer: {correct}")

        # Check solution
        solution = question.get('solution', '')
        if not solution:
            issues.append("❌ Missing solution")
        elif len(solution) < self.min_solution_length:
            issues.append(f"⚠️ Solution too brief ({len(solution)} chars, recommend 100+)")

        # Check if solution actually explains something
        if solution and not any(word in solution.lower() for word in ['step', 'calculate', 'because', 'therefore', 'thus', 'hence', 'reaction', 'mechanism']):
            issues.append("⚠️ Solution lacks detailed explanation")

        # Check concepts tested
        concepts = question.get('concepts_tested', [])
        if not concepts:
            issues.append("⚠️ No concepts listed")
        elif len(concepts) < 2:
            issues.append("⚠️ Only one concept listed (recommend 2+)")

        # Check difficulty
        difficulty = question.get('difficulty', '')
        if difficulty not in ['Easy', 'Medium', 'Hard']:
            issues.append(f"⚠️ Invalid difficulty: {difficulty}")

        # Check for common mistake
        if not question.get('common_mistake'):
            issues.append("⚠️ Missing common mistake explanation")

        # Check for olympiad insight
        if not question.get('olympiad_insight'):
            issues.append("⚠️ Missing olympiad insight")

        # Check for question quality indicators
        if q_text:
            # Check if question is too simple
            simple_indicators = ['what is', 'which of the following is', 'define']
            if any(indicator in q_text.lower()[:50] for indicator in simple_indicators):
                issues.append("⚠️ Question may be too simple for Olympiad level")

            # Check for numerical/calculation aspect (good for physical chemistry)
            if 'calculate' in q_text.lower() or 'determine' in q_text.lower():
                if not any(char.isdigit() for char in q_text):
                    issues.append("⚠️ Calculation question lacks numerical data")

        is_valid = len([i for i in issues if i.startswith('❌')]) == 0

        return is_valid, issues

    def check_batch(self, questions: List[Dict]) -> Dict:
        """
        Check a batch of questions

        Returns:
            Dictionary with quality report
        """
        total = len(questions)
        valid_count = 0
        all_issues = []

        for idx, q in enumerate(questions, 1):
            is_valid, issues = self.check_question(q)
            if is_valid:
                valid_count += 1

            if issues:
                all_issues.append({
                    'question_num': idx,
                    'question_id': q.get('id', 'Unknown'),
                    'issues': issues
                })

        report = {
            'total_questions': total,
            'valid_questions': valid_count,
            'invalid_questions': total - valid_count,
            'quality_score': (valid_count / total * 100) if total > 0 else 0,
            'detailed_issues': all_issues
        }

        return report

    def print_quality_report(self, report: Dict):
        """Print formatted quality report"""
        print("\n" + "="*60)
        print("           QUESTION QUALITY REPORT")
        print("="*60)

        total = report['total_questions']
        valid = report['valid_questions']
        score = report['quality_score']

        print(f"\n📊 Quality Score: {score:.1f}%")
        print(f"   ✓ Valid questions: {valid}/{total}")
        print(f"   ✗ Questions with issues: {report['invalid_questions']}/{total}")

        if report['detailed_issues']:
            print("\n" + "-"*60)
            print("Detailed Issues:")
            print("-"*60)

            for item in report['detailed_issues']:
                print(f"\n  Question #{item['question_num']} (ID: {item['question_id']}):")
                for issue in item['issues']:
                    print(f"    {issue}")

            # Recommendations
            print("\n" + "-"*60)
            print("📝 Recommendations:")
            print("-"*60)

            critical_count = sum(1 for item in report['detailed_issues']
                               for issue in item['issues'] if issue.startswith('❌'))
            warning_count = sum(1 for item in report['detailed_issues']
                              for issue in item['issues'] if issue.startswith('⚠️'))

            if critical_count > 0:
                print(f"  • Fix {critical_count} critical issues (❌) before using these questions")
            if warning_count > 0:
                print(f"  • Address {warning_count} warnings (⚠️) to improve quality")

            if score < 60:
                print("  • Quality score below 60% - consider regenerating this batch")
            elif score < 80:
                print("  • Quality score acceptable but could be improved")
            else:
                print("  • Good quality! Minor improvements suggested")

        else:
            print("\n✅ All questions passed quality checks!")

        print("="*60 + "\n")

    def get_difficulty_distribution(self, questions: List[Dict]) -> Dict:
        """Check if difficulty distribution meets requirements"""
        total = len(questions)
        distribution = {'Easy': 0, 'Medium': 0, 'Hard': 0}

        for q in questions:
            diff = q.get('difficulty', 'Medium')
            if diff in distribution:
                distribution[diff] += 1

        # Calculate percentages
        percentages = {
            k: (v / total * 100) if total > 0 else 0
            for k, v in distribution.items()
        }

        return {
            'counts': distribution,
            'percentages': percentages,
            'target_percentages': {'Easy': 30, 'Medium': 50, 'Hard': 20}
        }

    def print_difficulty_analysis(self, questions: List[Dict]):
        """Print difficulty distribution analysis"""
        dist = self.get_difficulty_distribution(questions)

        print("\n" + "-"*60)
        print("Difficulty Distribution Analysis:")
        print("-"*60)

        for difficulty in ['Easy', 'Medium', 'Hard']:
            count = dist['counts'][difficulty]
            percentage = dist['percentages'][difficulty]
            target = dist['target_percentages'][difficulty]

            status = "✓" if abs(percentage - target) < 10 else "⚠️"

            print(f"  {status} {difficulty:6s}: {count:2d} questions ({percentage:5.1f}% | Target: {target}%)")

        print("-"*60)
