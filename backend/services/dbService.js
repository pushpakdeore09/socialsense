import OpenAI from "openai";
import "dotenv/config";
const stageTwo = new OpenAI({
  apiKey: "AIzaSyD844MwMhztnaILFnxPtfjMfAmuCU6lbVk",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const dbServiceStageTwo = async (data) => {
  const prompt = `
You are an expert evaluator for ML-based mental health text classification models.

-----------------------------------------
TASK: Sub-class Classification
-----------------------------------------

Sub-classes:
0 = Anxiety
1 = Bipolar
2 = Personality disorder
3 = Stress
4 = Suicidal

Rules:
- Treat the Stage-2 prediction and probabilities as outputs from a trained ML model.
- Only change the prediction if it is clearly inconsistent with the text.
- If the text expresses suicidal ideation (explicit thoughts of self-harm or death), the class must be 4 (Suicidal).
- Otherwise, keep the ML model prediction if reasonable.
- Adjust probabilities only if the prediction changes:
    - Probabilities must sum exactly to 1.
    - Highest probability must correspond to the final predicted class.
    - Keep changes minimal; preserve the original relative proportions.
- Focus on the context, emotional content, and behavioral intent in the text; do not rely on keywords alone.

-----------------------------------------
INPUT
-----------------------------------------

Text: "${data.text}"

Stage-2 Model Prediction: ${data.predicted_class}
Stage-2 Probabilities: ${JSON.stringify(data.probabilities)}

-----------------------------------------
OUTPUT FORMAT (JSON ONLY)
-----------------------------------------

{
"sub_valid": true|false or null,
"confidence": corresponding class probability or null,
"prediction": 0-4 or null,
"probabilities": [p1,p2,p3,p4,p5] or null
}

Rules:
- If the ML model prediction is correct, copy prediction, confidence, and probabilities exactly.
- Return JSON only.
- No explanations.`;
  try {
    const response = await stageTwo.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "Expert depression text classification evaluator. JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.0,
    });

    let content = response.choices[0].message.content;

    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(content);
  } catch {
    return {
      sub_valid: null,
      confidence: Math.max(...data.probabilities),
      prediction: data.prediction,
      probabilities: data.probabilities,
    };
  }
};

const recommendation = new OpenAI({
  apiKey: "AIzaSyD844MwMhztnaILFnxPtfjMfAmuCU6lbVk",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const recommendationService = async (data) => {
  const prompt = `
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
Detected Mental Health Class: ${data.predicted_class}
User Text: "${data.text}"
Age Group: ${data.age_group}
Gender: ${data.gender}
Profession: ${data.profession}

-----------------------------------------
TASK
-----------------------------------------
Generate concise and practical mental health recommendations based on:
- Emotional content of the text
- Detected mental health class
- User profession and lifestyle

IMPORTANT RULES:
- NEVER ask the user for more information
- ALWAYS generate recommendations even if the text is short
- Output MUST always follow the JSON format below
- Return JSON ONLY
- If class is Suicidal (4), include "emergency_support" field

-----------------------------------------
OUTPUT FORMAT (JSON)
-----------------------------------------
{
  "recommendations": [
    "recommendation 1",
    "recommendation 2",
    "recommendation 3"
  ],
  "lifestyle_suggestions": [
    "suggestion 1",
    "suggestion 2",
    "suggestion 3"
  ],
  "encouraging_message": "Short supportive message",
  "emergency_support": null
}
`;

  try {
    const response = await recommendation.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You are a mental health recommendation assistant. Respond only in valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    let content = response.choices[0].message.content;

    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(content);

    if (
      (data.predicted_class === 4 || data.predicted_class === "4") &&
      (!result.emergency_support ||
        Object.keys(result.emergency_support).length === 0)
    ) {
      result.emergency_support = {
        message: "You are not alone. Immediate support is available.",
        helplines: [
          "Kiran Mental Health Helpline: 1800-599-0019",
          "AASRA Suicide Prevention: +91-9820466726",
        ],
        emergency_number: "112",
      };
    }

    return result;
  } catch (error) {
    console.error("Recommendation service error:", error);
    return {
      recommendations: [],
      lifestyle_suggestions: [],
      encouraging_message: "",
      emergency_support: null,
    };
  }
};
