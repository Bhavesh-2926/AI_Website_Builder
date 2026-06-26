from typing import Dict, Any
import json
from app.core.config import settings
from openai import OpenAI

class DesignAgent:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    async def generate_design(
        self, requirements: Dict[str, Any], color_preferences: Dict[str, str] = None
    ) -> Dict[str, Any]:
        """
        Generates a design system configuration for the website.
        Considers theme preferences, business categories, and custom color preferences.
        """
        business_type = requirements.get("business_type", "Bakery")
        theme = requirements.get("theme", "Glassmorphism")

        # Basic default layout configs
        base_design = self._get_static_design_tokens(theme, color_preferences)

        if not self.client:
            return base_design

        try:
            prompt = (
                f"You are a UI/UX Design System Agent. Generate a visual design config JSON for a website:\n"
                f"Business Category: {business_type}\n"
                f"Theme: {theme}\n"
                f"User Color Preference: {json.dumps(color_preferences or {})}\n\n"
                f"Respond with a JSON object containing:\n"
                f"- 'font': (Google Font name, e.g., 'Inter', 'Outfit', 'Playfair Display', 'Poppins')\n"
                f"- 'primary': (HEX color)\n"
                f"- 'secondary': (HEX color)\n"
                f"- 'accent': (HEX color)\n"
                f"- 'background': (HEX color matching the theme)\n"
                f"- 'surface': (HEX color or translucent rgba for cards)\n"
                f"- 'text_color': (HEX color for primary text)\n"
                f"- 'border_radius': (string, e.g., '4px', '12px', '30px')\n"
                f"- 'styles': a dictionary containing style descriptors:\n"
                f"    - 'navbar': ('floating-glass', 'sticky-blur', 'classic-clean', 'minimalist')\n"
                f"    - 'hero': ('split-screen', 'centered-gradient', 'minimal-text', 'full-image-overlay')\n"
                f"    - 'card': ('glassmorphic-glow', 'border-outline', 'shadow-soft', 'flat-neon')\n"
                f"    - 'footer': ('dark-compact', 'grid-large', 'minimal-social')\n"
                f"    - 'animation': ('fade-in-up', 'smooth-slide', 'springy-pop', 'fade-only')\n\n"
                f"Ensure the colors have sufficient contrast, match the {theme} and {business_type} style, and look premium.\n"
                f"Respond ONLY with a JSON object. Do not include markdown codeblocks (like ```json), just raw JSON text."
            )

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a professional web UI/UX architect. Output strictly JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4
            )

            design_text = response.choices[0].message.content.strip()
            if design_text.startswith("```"):
                design_text = design_text.split("\n", 1)[1].rsplit("\n", 1)[0].strip()
                if design_text.startswith("json"):
                    design_text = design_text[4:].strip()

            enriched_design = json.loads(design_text)
            return enriched_design

        except Exception as e:
            print(f"DesignAgent AI generation failed: {e}. Using high-quality defaults.")
            return base_design

    def _get_static_design_tokens(
        self, theme: str, color_preferences: Dict[str, str] = None
    ) -> Dict[str, Any]:
        theme = theme.lower()
        
        # Pull preferences if present
        pref_primary = color_preferences.get("primary") if color_preferences else None
        pref_secondary = color_preferences.get("secondary") if color_preferences else None
        pref_accent = color_preferences.get("accent") if color_preferences else None

        tokens = {
            "font": "Inter",
            "primary": "#4F46E5",     # Indigo
            "secondary": "#06B6D4",   # Cyan
            "accent": "#F59E0B",      # Amber
            "background": "#0F172A",  # Slate 900
            "surface": "rgba(30, 41, 59, 0.7)",
            "text_color": "#F8FAFC",
            "border_radius": "16px",
            "styles": {
                "navbar": "floating-glass",
                "hero": "centered-gradient",
                "card": "glassmorphic-glow",
                "footer": "dark-compact",
                "animation": "fade-in-up"
            }
        }

        if theme == "glassmorphism":
            tokens.update({
                "font": "Outfit",
                "primary": pref_primary or "#818CF8",
                "secondary": pref_secondary or "#38BDF8",
                "accent": pref_accent or "#F43F5E",
                "background": "#0B0F19",
                "surface": "rgba(255, 255, 255, 0.04)",
                "text_color": "#F1F5F9",
                "border_radius": "20px",
                "styles": {
                    "navbar": "floating-glass",
                    "hero": "centered-gradient",
                    "card": "glassmorphic-glow",
                    "footer": "dark-compact",
                    "animation": "smooth-slide"
                }
            })
        elif theme == "modern":
            tokens.update({
                "font": "Poppins",
                "primary": pref_primary or "#10B981", # Emerald
                "secondary": pref_secondary or "#6366F1",
                "accent": pref_accent or "#EC4899",
                "background": "#FAFAFA",
                "surface": "#FFFFFF",
                "text_color": "#171717",
                "border_radius": "12px",
                "styles": {
                    "navbar": "sticky-blur",
                    "hero": "split-screen",
                    "card": "shadow-soft",
                    "footer": "grid-large",
                    "animation": "fade-in-up"
                }
            })
        elif theme == "luxury":
            tokens.update({
                "font": "Playfair Display",
                "primary": pref_primary or "#D4AF37", # Gold
                "secondary": pref_secondary or "#1C1C1C",
                "accent": pref_accent or "#800020",    # Burgundy
                "background": "#121212",
                "surface": "rgba(28, 28, 28, 0.8)",
                "text_color": "#F3E5AB",
                "border_radius": "4px",
                "styles": {
                    "navbar": "classic-clean",
                    "hero": "minimal-text",
                    "card": "border-outline",
                    "footer": "minimal-social",
                    "animation": "fade-only"
                }
            })
        elif theme == "minimal":
            tokens.update({
                "font": "Inter",
                "primary": pref_primary or "#000000",
                "secondary": pref_secondary or "#737373",
                "accent": pref_accent or "#A3A3A3",
                "background": "#FFFFFF",
                "surface": "#FAFAFA",
                "text_color": "#0A0A0A",
                "border_radius": "0px",
                "styles": {
                    "navbar": "minimalist",
                    "hero": "minimal-text",
                    "card": "border-outline",
                    "footer": "minimal-social",
                    "animation": "fade-only"
                }
            })
        elif theme == "dark":
            tokens.update({
                "font": "Outfit",
                "primary": pref_primary or "#3B82F6", # Blue
                "secondary": pref_secondary or "#10B981",
                "accent": pref_accent or "#8B5CF6",
                "background": "#030712",
                "surface": "#111827",
                "text_color": "#F9FAFB",
                "border_radius": "16px",
                "styles": {
                    "navbar": "sticky-blur",
                    "hero": "centered-gradient",
                    "card": "glassmorphic-glow",
                    "footer": "dark-compact",
                    "animation": "springy-pop"
                }
            })
        elif theme == "corporate":
            tokens.update({
                "font": "Roboto",
                "primary": pref_primary or "#1E3A8A", # Deep Blue
                "secondary": pref_secondary or "#4B5563",
                "accent": pref_accent or "#0D9488",
                "background": "#F3F4F6",
                "surface": "#FFFFFF",
                "text_color": "#1F2937",
                "border_radius": "8px",
                "styles": {
                    "navbar": "classic-clean",
                    "hero": "split-screen",
                    "card": "shadow-soft",
                    "footer": "grid-large",
                    "animation": "fade-in-up"
                }
            })

        return tokens

design_agent = DesignAgent()
