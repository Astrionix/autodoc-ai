import os
from groq import Groq
import json
from typing import List
from dotenv import load_dotenv

load_dotenv()

# Ensure we have the API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

def analyze_text(text_chunks: List[str]) -> dict:
    """
    Sends the document text to Groq LLM and retrieves structured output.
    Using JSON mode (structured output)
    """
    # For simplicity, we just use the first chunk if it's too large,
    # or concatenate a few chunks until we hit a safe token limit.
    # Groq LLaMA3 70b context translates to ~8192 tokens.
    text_to_analyze = text_chunks[0] if text_chunks else ""
    
    prompt = f"""Analyze the following academic document and return:
1. A concise summary
2. Key insights (bullet points)
3. Actionable learning points

Document:
{text_to_analyze}
"""

    # We enforce JSON output schema using system prompt
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a professional academic assistant. You must respond in ONLY valid JSON matching this exact structure: {\"summary\": \"...\", \"insights\": [\"...\", \"...\"], \"actions\": [\"...\", \"...\"]}. Do not include markdown formatting like ```json in the output, just the raw JSON object."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
        response_format={ "type": "json_object" }
    )
    
    try:
        content = response.choices[0].message.content
        result = json.loads(content)
        # Ensure correct keys
        return {
            "summary": result.get("summary", "No summary available."),
            "insights": result.get("insights", []),
            "actions": result.get("actions", [])
        }
    except Exception as e:
        print(f"Error parsing Groq response: {e}")
        return {
            "summary": "Failed to analyze document.",
            "insights": [],
            "actions": []
        }
