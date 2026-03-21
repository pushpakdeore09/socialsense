import os
from google import genai  # type: ignore
import re
import json
from dotenv import load_dotenv  # type: ignore

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)


def recommendation_service(data):
    prompt = f"""
You are a supportive mental health assistant that provides practical and empathetic recommendations.

-----------------------------------------
MENTAL HEALTH CLASSES
-----------------------------------------
0 = Anxiety
1 = Bipolar
2 = Personality Disorder
3 = Stress
4 = Suicidal

-----------------------------------------
AGE GROUP DEFINITIONS
-----------------------------------------
Adolescent = 13-17
Young Adult = 18-30
Adult = 31-45
Midlife = 46-60
Elderly = 60+

-----------------------------------------
USER INFORMATION
-----------------------------------------
Detected Mental Health Class: {data['predicted_class']}
User Text: "{data['text']}"
Age Group: {data['age_group']}
Gender: {data['gender']}
Profession: {data['profession']}

-----------------------------------------
TASK
-----------------------------------------
Generate concise and practical mental health recommendations based on:
- The emotional content of the text
- The detected mental health class
- The user's profession and lifestyle

IMPORTANT RULES:
- NEVER ask the user for more information
- ALWAYS generate recommendations even if the text is short
- Do NOT include summaries or explanations outside JSON
- Keep it concise: 4–5 lines total
- If class is Suicidal (4), include emergency_support field

-----------------------------------------
OUTPUT FORMAT (STRICT JSON)
-----------------------------------------
{{
  "recommendations": [
    "recommendation 1",
    "recommendation 2",
    "recommendation 3"
  ],
  "lifestyle_suggestions": [
    "suggestion 1",
    "suggestion 2",
    "suggestion 3",
    "suggestion 4
  ],
  "encouraging_message": "Short supportive message",
  "emergency_support": null
}}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        content = response.text
        content = re.sub(r"```json", "", content)
        content = re.sub(r"```", "", content).strip()

        json_match = re.search(r"\{.*\}", content, re.DOTALL)
        if json_match:
            content = json_match.group()

        result = json.loads(content)

        if str(data['predicted_class']).lower() == "4" and not result.get("emergency_support"):
            result["emergency_support"] = {
                "message": "You are not alone. Immediate support is available.",
                "helplines": [
                    "Kiran Mental Health Helpline: 1800-599-0019",
                    "AASRA Suicide Prevention: +91-9820466726"
                ],
                "emergency_number": "112"
            }

        return result

    except Exception as e:
        return {
            "recommendations": [],
            "lifestyle_suggestions": [],
            "encouraging_message": "",
            "emergency_support": None
        }