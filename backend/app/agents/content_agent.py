from typing import List, Dict, Any
import json
from app.core.config import settings
from openai import OpenAI

class ContentAgent:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    async def generate_content(
        self, requirements: Dict[str, Any]
    ) -> Dict[str, Dict[str, Any]]:
        """
        Generates full pages of text content for the website based on requirements.
        Returns a dictionary mapping page names to page contents.
        """
        business_name = requirements.get("business_name", "Local Business")
        business_type = requirements.get("business_type", "Bakery").lower()
        theme = requirements.get("theme", "Glassmorphism")
        pages = requirements.get("pages", ["Home", "About", "Services", "Contact"])

        # Attempt AI generation first if OpenAI client is active
        if self.client:
            try:
                return await self._generate_with_ai(business_name, business_type, theme, pages)
            except Exception as e:
                print(f"ContentAgent AI generation failed: {e}. Falling back to templates.")

        # Static, high-fidelity mock template data tailored to each business type
        return self._generate_from_templates(business_name, business_type, pages)

    async def _generate_with_ai(
        self, business_name: str, business_type: str, theme: str, pages: List[str]
    ) -> Dict[str, Dict[str, Any]]:
        page_contents = {}

        for page in pages:
            prompt = (
                f"You are a Conversion Copywriter Agent. Generate website content for the '{page}' page of a business website.\n"
                f"Business Name: {business_name}\n"
                f"Business Type: {business_type}\n"
                f"Website Design Theme: {theme}\n\n"
                f"Based on the page name '{page}', please structure the content to include appropriate sections:\n"
                f"- If page is 'Home': Provide 'hero' (title, subtitle, cta_text), 'features' (array of 3 items with icon, title, description), and 'intro' text.\n"
                f"- If page is 'About': Provide 'story' (headline, full_text), and 'values' (array of 3 core values).\n"
                f"- If page is 'Services' or 'Menu' or 'Gallery': Provide a section title, introductory text, and an array of 'items' (each with name/title, description, price if relevant, image_url placeholder).\n"
                f"- If page is 'Testimonials': Provide 'title', 'subtitle', and a list of 'reviews' (array of 3 reviews with author name, role, review text, rating).\n"
                f"- If page is 'Blog': Provide 'title', 'subtitle', and an array of 3 'posts' (title, excerpt, author, date, read_time).\n"
                f"- If page is 'Contact': Provide 'headline', 'email', 'phone', 'address', 'hours' (array of strings), and 'embed_map_url'.\n\n"
                f"Provide Unsplash search query keywords for images or specify clean image URLs matching the business category.\n"
                f"Respond ONLY with a valid JSON object matching this page structure. Do not include markdown codeblocks (like ```json), just raw JSON text."
            )

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a professional web content generator. Output strictly JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )

            content_text = response.choices[0].message.content.strip()
            if content_text.startswith("```"):
                content_text = content_text.split("\n", 1)[1].rsplit("\n", 1)[0].strip()
                if content_text.startswith("json"):
                    content_text = content_text[4:].strip()

            page_contents[page] = json.loads(content_text)

        return page_contents

    def _generate_from_templates(
        self, business_name: str, business_type: str, pages: List[str]
    ) -> Dict[str, Dict[str, Any]]:
        page_contents = {}

        # Set up default imagery keywords/links based on business category
        category_images = {
            "bakery": [
                "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=600&q=80"
            ],
            "cafe": [
                "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80"
            ],
            "restaurant": [
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80"
            ],
            "gym": [
                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80"
            ],
            "portfolio": [
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
            ],
            "agency": [
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-152202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80"
            ],
            "ecommerce": [
                "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80"
            ],
        }

        imgs = category_images.get(business_type, category_images["bakery"])

        # Default static templates mapping page name to content JSON
        for page in pages:
            if page == "Home":
                page_contents["Home"] = {
                    "hero": {
                        "title": f"Welcome to {business_name}",
                        "subtitle": f"Experience the finest {business_type} services tailored specifically for you.",
                        "cta_text": "Get Started",
                        "image_url": imgs[0]
                    },
                    "features": [
                        {
                            "icon": "Award",
                            "title": "Premium Quality",
                            "description": "We use only the finest resources and hand-picked ingredients to ensure excellence."
                        },
                        {
                            "icon": "Sparkles",
                            "title": "Expert Craft",
                            "description": "Our team holds years of seasoned training and dedication to their craft."
                        },
                        {
                            "icon": "Heart",
                            "title": "Made with Passion",
                            "description": "Every single service or product is made with love and commitment to your satisfaction."
                        }
                    ],
                    "intro": f"Welcome to {business_name}. We take pride in delivering top-notch {business_type} solutions to our community. Our goal is to blend traditional excellence with modern innovation, ensuring that you receive the absolute best experience."
                }
            elif page == "About":
                page_contents["About"] = {
                    "story": {
                        "headline": "Our Journey & Story",
                        "full_text": f"Founded with a vision to redefine {business_type} services, {business_name} has grown from a humble start to a leading destination in the area. We strive daily to keep our values alive, supporting local sourcing and building strong relationships with our clients.",
                        "image_url": imgs[1]
                    },
                    "values": [
                        {"title": "Integrity First", "desc": "We act with honesty and transparency in everything we create."},
                        {"title": "Constant Innovation", "desc": "We adapt and innovate our methods to stay at the cutting edge."},
                        {"title": "Community Loyalty", "desc": "Giving back and supporting our local community is in our DNA."}
                    ]
                }
            elif page in ["Services", "Menu", "Gallery"]:
                items = []
                if business_type == "bakery":
                    items = [
                        {"name": "Signature Sourdough", "description": "Crispy crust, soft airy inside. Fermented for 24 hours.", "price": "$7.50", "image_url": imgs[0]},
                        {"name": "Chocolate Croissants", "description": "Buttery, flaky puff pastry loaded with dark Belgian chocolate.", "price": "$4.50", "image_url": imgs[1]},
                        {"name": "Custom Celebration Cakes", "description": "Multi-layered cakes tailored to your theme, taste, and occasion.", "price": "From $45.00", "image_url": imgs[2]}
                    ]
                elif business_type == "cafe":
                    items = [
                        {"name": "Espresso Macchiato", "description": "Rich espresso shot marked with a dollop of creamy microfoam.", "price": "$3.50", "image_url": imgs[0]},
                        {"name": "Cold Brew Tonic", "description": "Our 12-hour cold brew layered over bubbly premium tonic water.", "price": "$5.00", "image_url": imgs[1]},
                        {"name": "Avocado Sourdough Toast", "description": "Fresh avocado smash, chili flakes, sea salt, and organic olive oil.", "price": "$11.00", "image_url": imgs[2]}
                    ]
                elif business_type == "restaurant":
                    items = [
                        {"name": "Pan-Seared Ribeye", "description": "Served with rosemary butter, roasted garlic, and truffle fries.", "price": "$34.00", "image_url": imgs[0]},
                        {"name": "Wild Mushroom Risotto", "description": "Creamy arborio rice with chanterelle, shiitake, and aged parmesan.", "price": "$22.00", "image_url": imgs[1]},
                        {"name": "Molten Chocolate Lava Cake", "description": "Rich cake with a gooey warm center, served with vanilla bean ice cream.", "price": "$10.00", "image_url": imgs[2]}
                    ]
                elif business_type == "gym":
                    items = [
                        {"name": "HIIT Training", "description": "High intensity interval training targeting fat loss and stamina.", "price": "$25 / Session", "image_url": imgs[0]},
                        {"name": "Strength Coaching", "description": "Personalized weightlifting program to optimize strength and muscle.", "price": "$80 / Hour", "image_url": imgs[1]},
                        {"name": "Yoga & Flex Flow", "description": "Vinyasa flow sessions focusing on breathing, flexibility, and core.", "price": "$20 / Session", "image_url": imgs[2]}
                    ]
                else: # Portfolio / Agency / Ecommerce
                    items = [
                        {"name": "Basic Package", "description": "Entry-level setup to get your branding online in a flash.", "price": "$499", "image_url": imgs[0]},
                        {"name": "Growth Acceleration", "description": "Full design, database setup, and customized integrations.", "price": "$1299", "image_url": imgs[1]},
                        {"name": "Enterprise Blueprint", "description": "Fully custom software development and dedicated support.", "price": "$2999", "image_url": imgs[2]}
                    ]

                page_contents[page] = {
                    "title": f"Our {page}",
                    "subtitle": f"Browse through our curated select list of {business_type} items.",
                    "items": items
                }
            elif page == "Testimonials":
                page_contents["Testimonials"] = {
                    "title": "What Our Clients Say",
                    "subtitle": f"Read reviews from real customers who trusted {business_name}.",
                    "reviews": [
                        {
                            "name": "Sarah Jenkins",
                            "role": "Local Guide",
                            "text": f"The experience is always incredible. {business_name} never fails to impress me with their attention to detail and customer care.",
                            "rating": 5
                        },
                        {
                            "name": "Marcus Chen",
                            "role": "Verified Customer",
                            "text": f"Hands down the best {business_type} in town. I highly recommend them to all my friends and family. Worth every single penny!",
                            "rating": 5
                        },
                        {
                            "name": "Emma Watson",
                            "role": "Loyal Patron",
                            "text": "Friendly staff, outstanding atmosphere, and top-tier services. I come here at least once a week!",
                            "rating": 4
                        }
                    ]
                }
            elif page == "Blog":
                page_contents["Blog"] = {
                    "title": "Industry Insights & News",
                    "subtitle": f"Tips, articles, and guides from the {business_name} team.",
                    "posts": [
                        {
                            "title": f"Why Quality Matters in {business_type}",
                            "excerpt": "Discover how choosing premium ingredients or materials impacts long term success and customer happiness.",
                            "author": "Founder",
                            "date": "June 15, 2026",
                            "read_time": "5 min read"
                        },
                        {
                            "title": "5 Tips to Improve Your Daily Routine",
                            "excerpt": "A short guide crafted by our experts detailing simple habits you can implement starting today.",
                            "author": "Staff Writer",
                            "date": "May 28, 2026",
                            "read_time": "3 min read"
                        },
                        {
                            "title": "Behind the Scenes: How We Work",
                            "excerpt": "A deep dive into our kitchen, gym floor, or studio to see the exact processes we use behind closed doors.",
                            "author": "Manager",
                            "date": "April 12, 2026",
                            "read_time": "7 min read"
                        }
                    ]
                }
            elif page == "Contact":
                page_contents["Contact"] = {
                    "headline": "Get In Touch",
                    "email": f"hello@{business_name.lower().replace(' ', '')}.com",
                    "phone": "(555) 019-2834",
                    "address": "123 Innovation Boulevard, Suite 400, Tech City, TC 94016",
                    "hours": [
                        "Monday - Friday: 8:00 AM - 6:00 PM",
                        "Saturday: 9:00 AM - 4:00 PM",
                        "Sunday: Closed"
                    ],
                    "embed_map_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d-122.41941550000001!3d37.77492929999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807bedb1b827%3A0x7d025114811a2f60!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1655000000000!5m2!1sen!2sus"
                }

        return page_contents

content_agent = ContentAgent()
