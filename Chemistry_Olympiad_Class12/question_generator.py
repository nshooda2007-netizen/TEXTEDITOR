"""
Chemistry Olympiad Question Generator Module
Uses Anthropic API to generate high-quality Olympiad-level questions
"""

import anthropic
import json
import os
import time
from typing import Dict, List, Optional
import re

class QuestionGenerator:
    def __init__(self, api_key: str):
        """Initialize the question generator with Anthropic API key"""
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = "claude-sonnet-4-5-20250929"

    def generate_questions(self, topic_info: Dict, batch_size: int = 10) -> Optional[Dict]:
        """
        Generate a batch of questions for a specific topic

        Args:
            topic_info: Dictionary containing branch, topic, and difficulty info
            batch_size: Number of questions to generate (default 10)

        Returns:
            Dictionary with generated questions or None if failed
        """
        prompt = self._create_prompt(topic_info, batch_size)

        try:
            print(f"  🔄 Calling Anthropic API...")
            message = self.client.messages.create(
                model=self.model,
                max_tokens=8000,
                temperature=1,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            # Extract the response text
            response_text = message.content[0].text

            # Try to parse JSON from the response
            questions_data = self._extract_json(response_text)

            if questions_data:
                # Validate and enhance the data
                questions_data = self._validate_and_enhance(questions_data, topic_info)
                return questions_data
            else:
                print("  ❌ Failed to extract valid JSON from response")
                return None

        except Exception as e:
            print(f"  ❌ API Error: {str(e)}")
            return None

    def _create_prompt(self, topic_info: Dict, batch_size: int) -> str:
        """Create the detailed prompt for question generation"""
        branch = topic_info['branch']
        topic = topic_info['topic']
        level = topic_info.get('olympiad_level', 'NSEC')

        # Customize prompt based on branch
        focus_area = ""
        if branch == "Organic_Chemistry":
            focus_area = "organic mechanisms, synthesis problems, reaction intermediates, stereochemistry"
        elif branch == "Physical_Chemistry":
            focus_area = "numerical problems, thermodynamic calculations, kinetic analysis, electrochemical cells"
        elif branch == "Inorganic_Chemistry":
            focus_area = "structure-property relationships, coordination chemistry, periodic trends, transition metal chemistry"

        prompt = f"""You are an expert Chemistry Olympiad question creator with experience in IChO and NSEC competitions.

Create {batch_size} Olympiad-level chemistry questions for Class 12 on the topic: {topic}

BRANCH: {branch.replace('_', ' ')}
DIFFICULTY: Olympiad standard (beyond JEE/NEET) - {level} level
FOCUS ON: {focus_area}

Each question MUST include:
1. Clear problem statement with proper chemical notation (use subscripts like H₂SO₄)
2. Four options (A, B, C, D) with plausible distractors based on common misconceptions
3. Detailed step-by-step solution showing all work
4. List of specific concepts being tested
5. Common mistake that students typically make
6. Advanced Olympiad-level insight
7. Marks (typically 4) and time estimate

QUESTION TYPES TO INCLUDE:
- Multi-step reasoning problems
- Conceptual questions testing deep understanding
- Numerical problems requiring calculations
- Questions combining multiple concepts
- Exception cases and edge conditions
- Real-world applications

QUALITY REQUIREMENTS:
✓ Questions should require 2-5 minutes to solve
✓ Include at least 2-3 questions combining multiple concepts
✓ Avoid direct textbook questions
✓ Test conceptual understanding, not just memorization
✓ Include tricky aspects that separate good students from excellent ones

Return ONLY a valid JSON object in this EXACT format (no additional text):

{{
  "subject": "Chemistry",
  "branch": "{branch}",
  "topic": "{topic}",
  "class": 12,
  "olympiad_level": "{level}",
  "questions": [
    {{
      "id": "unique_id_1",
      "question": "Complete question text with chemical formulas",
      "options": {{
        "A": "option A text",
        "B": "option B text",
        "C": "option C text",
        "D": "option D text"
      }},
      "correct_answer": "A",
      "difficulty": "Medium",
      "solution": "Detailed step-by-step solution with all calculations/mechanisms",
      "concepts_tested": ["concept1", "concept2", "concept3"],
      "common_mistake": "What students typically get wrong and why",
      "olympiad_insight": "Advanced understanding or trick that makes this Olympiad-level",
      "marks": 4,
      "time_estimate": "3-4 minutes"
    }}
  ]
}}

Generate {batch_size} high-quality questions now. Return ONLY the JSON, nothing else."""

        return prompt

    def _extract_json(self, text: str) -> Optional[Dict]:
        """Extract JSON from response text"""
        # Try to find JSON in the response
        try:
            # First try direct parsing
            return json.loads(text)
        except json.JSONDecodeError:
            # Try to find JSON block
            json_match = re.search(r'\{[\s\S]*\}', text)
            if json_match:
                try:
                    return json.loads(json_match.group())
                except json.JSONDecodeError:
                    pass

        return None

    def _validate_and_enhance(self, data: Dict, topic_info: Dict) -> Dict:
        """Validate and enhance the generated questions"""
        # Ensure all required fields exist
        if 'questions' not in data:
            return data

        for idx, q in enumerate(data['questions']):
            # Generate ID if missing
            if 'id' not in q or not q['id']:
                timestamp = int(time.time())
                q['id'] = f"{topic_info['branch']}_{topic_info['topic'].replace(' ', '_')}_{timestamp}_{idx+1}"

            # Ensure difficulty is set
            if 'difficulty' not in q:
                q['difficulty'] = 'Medium'

            # Ensure marks is set
            if 'marks' not in q:
                q['marks'] = 4

            # Ensure time_estimate is set
            if 'time_estimate' not in q:
                q['time_estimate'] = '2-3 minutes'

            # Ensure all required arrays/objects exist
            if 'concepts_tested' not in q:
                q['concepts_tested'] = []
            if 'options' not in q or not isinstance(q['options'], dict):
                q['options'] = {"A": "", "B": "", "C": "", "D": ""}

        return data

    def retry_generate(self, topic_info: Dict, batch_size: int = 10, max_retries: int = 3) -> Optional[Dict]:
        """Generate questions with retry logic"""
        for attempt in range(max_retries):
            if attempt > 0:
                wait_time = 2 ** attempt  # Exponential backoff
                print(f"  ⏳ Retry attempt {attempt + 1}/{max_retries} in {wait_time}s...")
                time.sleep(wait_time)

            result = self.generate_questions(topic_info, batch_size)
            if result:
                return result

        return None
