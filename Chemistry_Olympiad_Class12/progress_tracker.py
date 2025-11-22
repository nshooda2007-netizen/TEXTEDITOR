"""
Progress Tracker Module
Tracks question generation progress across all topics
"""

import json
import os
from datetime import datetime
from typing import Dict, List

class ProgressTracker:
    def __init__(self, progress_dir: str = "progress"):
        """Initialize progress tracker"""
        self.progress_dir = progress_dir
        self.progress_file = os.path.join(progress_dir, "progress.json")
        self.progress_data = self._load_progress()

    def _load_progress(self) -> Dict:
        """Load existing progress or create new"""
        if os.path.exists(self.progress_file):
            try:
                with open(self.progress_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                pass

        # Default progress structure
        return {
            "total_questions": 0,
            "last_updated": None,
            "branches": {
                "Organic_Chemistry": {"total": 0, "target": 80, "topics": {}},
                "Physical_Chemistry": {"total": 0, "target": 70, "topics": {}},
                "Inorganic_Chemistry": {"total": 0, "target": 50, "topics": {}}
            },
            "difficulty_distribution": {
                "Easy": 0,
                "Medium": 0,
                "Hard": 0
            }
        }

    def _save_progress(self):
        """Save progress to file"""
        self.progress_data["last_updated"] = datetime.now().isoformat()
        with open(self.progress_file, 'w', encoding='utf-8') as f:
            json.dump(self.progress_data, f, indent=2, ensure_ascii=False)

    def add_questions(self, branch: str, topic: str, questions: List[Dict]):
        """Add newly generated questions to progress"""
        if branch not in self.progress_data["branches"]:
            self.progress_data["branches"][branch] = {"total": 0, "topics": {}}

        # Update topic count
        if topic not in self.progress_data["branches"][branch]["topics"]:
            self.progress_data["branches"][branch]["topics"][topic] = 0

        num_questions = len(questions)
        self.progress_data["branches"][branch]["topics"][topic] += num_questions
        self.progress_data["branches"][branch]["total"] += num_questions
        self.progress_data["total_questions"] += num_questions

        # Update difficulty distribution
        for q in questions:
            difficulty = q.get("difficulty", "Medium")
            if difficulty in self.progress_data["difficulty_distribution"]:
                self.progress_data["difficulty_distribution"][difficulty] += 1

        self._save_progress()

    def get_progress_summary(self) -> str:
        """Get formatted progress summary"""
        data = self.progress_data
        total = data["total_questions"]
        target_total = 200

        lines = []
        lines.append("\n" + "="*60)
        lines.append("           CHEMISTRY OLYMPIAD QUESTION BANK")
        lines.append("                 PROGRESS TRACKER")
        lines.append("="*60)
        lines.append(f"\n📊 Overall Progress: {total}/{target_total} questions ({total/target_total*100:.1f}%)")

        # Progress bar
        bar_length = 40
        filled = int(bar_length * total / target_total)
        bar = "█" * filled + "░" * (bar_length - filled)
        lines.append(f"   [{bar}]")

        lines.append("\n" + "-"*60)
        lines.append("📚 Branch-wise Progress:")
        lines.append("-"*60)

        for branch, info in data["branches"].items():
            branch_name = branch.replace("_", " ")
            total_q = info["total"]
            target_q = info.get("target", 0)
            percentage = (total_q / target_q * 100) if target_q > 0 else 0

            lines.append(f"\n  {branch_name}:")
            lines.append(f"    Questions: {total_q}/{target_q} ({percentage:.1f}%)")

            # Branch progress bar
            branch_bar_length = 30
            branch_filled = int(branch_bar_length * total_q / target_q) if target_q > 0 else 0
            branch_bar = "█" * branch_filled + "░" * (branch_bar_length - branch_filled)
            lines.append(f"    [{branch_bar}]")

            if info["topics"]:
                lines.append("    Topics covered:")
                for topic, count in sorted(info["topics"].items()):
                    lines.append(f"      • {topic}: {count} questions")

        lines.append("\n" + "-"*60)
        lines.append("📈 Difficulty Distribution:")
        lines.append("-"*60)
        diff_dist = data["difficulty_distribution"]
        for difficulty, count in diff_dist.items():
            percentage = (count / total * 100) if total > 0 else 0
            lines.append(f"  {difficulty:8s}: {count:3d} questions ({percentage:.1f}%)")

        if data.get("last_updated"):
            lines.append(f"\n🕒 Last updated: {data['last_updated'][:19]}")

        lines.append("="*60 + "\n")

        return "\n".join(lines)

    def get_topic_count(self, branch: str, topic: str) -> int:
        """Get number of questions for a specific topic"""
        if branch in self.progress_data["branches"]:
            topics = self.progress_data["branches"][branch].get("topics", {})
            return topics.get(topic, 0)
        return 0

    def get_remaining_by_branch(self) -> Dict[str, int]:
        """Get remaining questions needed per branch"""
        remaining = {}
        for branch, info in self.progress_data["branches"].items():
            target = info.get("target", 0)
            current = info.get("total", 0)
            remaining[branch] = max(0, target - current)
        return remaining

    def is_complete(self) -> bool:
        """Check if all 200 questions are generated"""
        return self.progress_data["total_questions"] >= 200
