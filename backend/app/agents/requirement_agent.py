from typing import List, Dict, Any
import json
from app.core.config import settings
from openai import OpenAI

class RequirementAgent:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    async def generate_requirements(
        self, business_name: str, business_type: str, theme: str, pages: List[str]
    ) -> Dict[str, Any]:
        """
        Processes and structures the website requirements.
        Uses OpenAI if available to embellish goals, target audience, and page requirements.
        """
        # Standard structured requirements outline
        base_requirements = {
            "business_name": business_name,
            "business_type": business_type,
            "theme": theme,
            "pages": pages,
            "target_audience": f"Customers looking for {business_type} services",
            "goals": [
                f"Showcase {business_name}'s branding and services",
                "Provide an easy contact/inquiry mechanism for visitors",
                "Ensure high readability and modern visual appeal"
            ],
            "seo_hints": f"{business_name}, local {business_type}, professional services"
        }

        if not self.client:
            # Return basic mock details if OpenAI is not available
            return base_requirements

        try:
            prompt = (
                f"You are a Business Analyst Agent. Analyze the following website requirements and enrich them:\n"
                f"Business Name: {business_name}\n"
                f"Business Type: {business_type}\n"
                f"Theme: {theme}\n"
                f"Requested Pages: {', '.join(pages)}\n\n"
                f"Respond ONLY with a JSON object containing the keys:\n"
                f"- 'business_name': (string)\n"
                f"- 'business_type': (string)\n"
                f"- 'theme': (string)\n"
                f"- 'pages': (array of strings)\n"
                f"- 'target_audience': (string description of target customers)\n"
                f"- 'goals': (array of 3 specific goals for this business website)\n"
                f"- 'seo_hints': (comma-separated string of recommended SEO tags/keywords)\n"
                f"Do not include any markdown formatting (like ```json) in your response, just raw JSON."
            )

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a professional business analyst. Output strictly JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2
            )

            result_text = response.choices[0].message.content.strip()
            # Remove markdown JSON wrappers if OpenAI returns them despite instructions
            if result_text.startswith("```"):
                result_text = result_text.split("\n", 1)[1].rsplit("\n", 1)[0].strip()
                if result_text.startswith("json"):
                    result_text = result_text[4:].strip()

            enriched_data = json.loads(result_text)
            return enriched_data

        except Exception as e:
            print(f"Error in RequirementAgent: {e}. Falling back to default.")
            return base_requirements

requirement_agent = RequirementAgent()
