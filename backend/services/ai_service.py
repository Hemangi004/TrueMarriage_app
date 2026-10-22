import random
from typing import Any, Dict
import httpx

AI_SUGGESTIONS_DATABASE = {
    "summary": [
        "I work as a Senior AI Engineer, where I focus on building intelligent products. Outside work, I love spending weekends exploring new cafes, reading fiction, and staying close with my family. Looking for someone genuine, cheerful, and understanding to build a happy life together.",
        "Working in corporate leadership keeps my days engaging, but I always make time for family dinners, classical music, and outdoor walks. I value mutual respect, warm conversations, and a lighthearted approach to life.",
        "Based in Mumbai, I lead product engineering teams. When I am off the clock, you will usually find me cooking, hitting the gym, or planning weekend getaways. Hoping to connect with a warm, family-minded partner."
    ],
    "expectations": [
        "Looking for a warm-hearted, progressive partner with strong family values, open communication, and mutual respect.",
        "Seeking an educated, independent, and understanding life partner who enjoys meaningful conversations and traveling.",
        "Hoping to connect with a compassionate partner who balances career ambitions with family life."
    ],
    "hobbies": [
        ["Reading", "Travel", "Photography", "Gym", "Meditation"],
        ["Cooking", "Music", "Movies", "Yoga", "Adventure"],
        ["Painting", "Dance", "Sports", "Gaming", "Reading"]
    ]
}

MASTER_SYSTEM_PROMPT = """You are an AI Wedding Biodata Bio Generator.

Your task is to create a short, natural, personalized matrimonial bio based ONLY on the information provided by the user.

IMPORTANT RULES:

1. ALWAYS write in FIRST PERSON, as if the person is introducing themselves directly.
2. Start naturally with:
   - "Hi, I'm [Name]..."
   - "Hello, I'm [Name]..."
   - "Hi, I am [Name]..."
   - "Hello! I'm [Name]..."
   Do NOT start with "[Name] is..." or "He/She is...".
3. The bio MUST be a maximum of 3 lines and approximately 30–45 words.
4. Make it sound like a real person, not an AI-generated matrimonial advertisement.
5. Do NOT invent any information, hobbies, achievements, family details, profession, or personality traits.
6. Do NOT use generic or repetitive phrases such as "kind-hearted", "loving soul", "perfect partner", or "beautiful journey" unless they are specifically supported by the user's information.
7. Every generated bio should be different in wording and sentence structure. Never copy a previous bio.
8. Mention only the most relevant 2–4 details instead of trying to include every piece of information.
9. End naturally with the person's relationship expectation or values when that information is available.
10. Output ONLY the bio. Do not provide explanations, headings, bullet points, labels, or quotation marks.

STYLE INSTRUCTION:

The selected style is: {style_name}
{style_detail}

CRITICAL:
The selected style must change the focus, wording, tone, and sentence structure. Do NOT generate the same bio for different styles with only a few words changed.

Generate exactly ONE bio.
Maximum 3 lines.
Approximately 30–45 words.
First person.
Natural opening.
Personalized to the user's information.
Output only the bio text."""

STYLE_DEFINITIONS = {
    "warm_balanced": (
        "WARM & BALANCED",
        "Focus on personality, lifestyle, hobbies, career, family, and a balanced life. Keep it warm and approachable."
    ),
    "modern_professional": (
        "MODERN PROFESSIONAL",
        "Focus more on career, education, ambitions, independence, lifestyle, and modern relationship values. Keep it confident and contemporary."
    ),
    "traditional_cultural": (
        "TRADITIONAL & CULTURAL",
        "Focus more on family, values, upbringing, traditions, respect, and togetherness. Keep it graceful and sincere."
    ),
    "heartfelt_direct": (
        "HEARTFELT & DIRECT",
        "Focus on personality, emotions, companionship, happiness, and what the person genuinely wants in a relationship. Make it conversational and personal."
    ),
}

TONE_ALIASES = {
    "balanced": "warm_balanced",
    "warm": "warm_balanced",
    "warm_balanced": "warm_balanced",
    "professional": "modern_professional",
    "modern": "modern_professional",
    "modern_professional": "modern_professional",
    "traditional": "traditional_cultural",
    "cultural": "traditional_cultural",
    "traditional_cultural": "traditional_cultural",
    "romantic": "heartfelt_direct",
    "heartfelt": "heartfelt_direct",
    "direct": "heartfelt_direct",
    "heartfelt_direct": "heartfelt_direct",
}


async def generate_ai_bio(body: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates personalized matrimonial bios using local Ollama model (llama3) with smart fallback.
    """
    req_type = body.get("type")
    user_data = body.get("userData", {})
    previous_bio = body.get("previousBio")
    raw_tone = body.get("tone", "warm_balanced")
    canonical_tone = TONE_ALIASES.get(str(raw_tone).lower(), "warm_balanced")
    model = body.get("model", "llama3")
    from backend.core.config import settings
    use_ai = body.get("useOllama", False) or (req_type in ["summary", "ollama_summary", "expectations"]) or bool(settings.GROQ_API_KEY)

    if use_ai:
        try:
            education_list = user_data.get("educationList", [])
            main_edu = education_list[0] if education_list else {}
            degree_str = main_edu.get("degree") or user_data.get("highestQualification", "")
            college_str = main_edu.get("college", "")
            uni_str = main_edu.get("university", "")
            hobbies_list = user_data.get("hobbies", [])
            languages_list = user_data.get("languagesKnown", [])

            user_details_text = f"""Name: {user_data.get('name', '')}
Age: {user_data.get('age', '')}
Gender: {user_data.get('gender', '')}

Education:
- Degree: {degree_str}
- College: {college_str}
- University: {uni_str}

Career:
- Occupation: {user_data.get('occupation', '')}
- Company: {user_data.get('company', '')}
- Designation: {user_data.get('designation', '')}
- Experience: {str(user_data.get('experienceYears')) + ' years' if user_data.get('experienceYears') else ''}

Family:
- Family Type: {user_data.get('familyType', '')}
- Family Values: {user_data.get('familyValues', '')}
- Native Place: {user_data.get('nativePlace', '')}

Lifestyle:
- Diet: {user_data.get('diet', '')}
- Smoking: {user_data.get('smoking', '')}
- Drinking: {user_data.get('drinking', '')}
- Hobbies: {', '.join(hobbies_list)}

Religion:
{user_data.get('religion', '')}

Caste:
{user_data.get('caste', '')}

Languages Known:
{', '.join(languages_list)}

Partner Expectations:
- Expected Education: {user_data.get('expectedEducation', '')}
- Expected Profession: {user_data.get('expectedProfession', '')}
- Expected Location: {user_data.get('expectedLocation', '')}
- Other Preferences: {user_data.get('otherPreferences', '')}"""

            style_name, style_detail = STYLE_DEFINITIONS.get(
                canonical_tone, STYLE_DEFINITIONS["warm_balanced"]
            )
            system_instruction = MASTER_SYSTEM_PROMPT.format(
                style_name=style_name, style_detail=style_detail
            )

            prompt = f"""User Information:
{user_details_text}

Generate the bio (maximum 3 lines, ~30–45 words) now:"""
            if previous_bio:
                prompt = f"""IMPORTANT: Generate a completely new version with different wording and sentence structure.
Previous version to avoid repeating:
{previous_bio}

{prompt}"""

            # 1. Prefer Groq Cloud API if configured (ultra-fast, cloud inference)
            if settings.GROQ_API_KEY and settings.GROQ_API_KEY.strip():
                try:
                    async with httpx.AsyncClient(timeout=10.0) as client:
                        groq_res = await client.post(
                            "https://api.groq.com/openai/v1/chat/completions",
                            headers={
                                "Authorization": f"Bearer {settings.GROQ_API_KEY.strip()}",
                                "Content-Type": "application/json",
                            },
                            json={
                                "model": settings.GROQ_MODEL,
                                "messages": [
                                    {"role": "system", "content": system_instruction},
                                    {"role": "user", "content": prompt}
                                ],
                                "temperature": 0.7,
                                "max_tokens": 600
                            }
                        )
                        if groq_res.status_code == 200:
                            data = groq_res.json()
                            response_text = data["choices"][0]["message"]["content"].strip().strip("\"'")
                            if response_text:
                                return {
                                    "success": True,
                                    "source": "groq",
                                    "model": settings.GROQ_MODEL,
                                    "tone": canonical_tone,
                                    "summary": response_text,
                                    "suggestions": [response_text, *AI_SUGGESTIONS_DATABASE["summary"]]
                                }
                except Exception as groq_err:
                    print(f"[AI Service] Groq API call failed, falling back: {groq_err}")

            # 2. Local Ollama fallback if Groq not set or unavailable
            async with httpx.AsyncClient(timeout=4.0) as client:
                ollama_res = await client.post(
                    "http://127.0.0.1:11434/api/generate",
                    json={
                        "model": model,
                        "system": system_instruction,
                        "prompt": f"{system_instruction}\n\n{prompt}",
                        "stream": False
                    }
                )
                if ollama_res.status_code == 200:
                    data = ollama_res.json()
                    response_text = data.get("response", "").strip().strip("\"'")
                    if response_text:
                        return {
                            "success": True,
                            "source": "ollama",
                            "model": model,
                            "tone": canonical_tone,
                            "summary": response_text,
                            "suggestions": [response_text, *AI_SUGGESTIONS_DATABASE["summary"]]
                        }
        except Exception:
            pass

        name = user_data.get("name") or "Aarav"
        occ = user_data.get("occupation") or "Software Professional"
        comp = f"at {user_data.get('company')}" if user_data.get("company") else ""
        hobbies_list = user_data.get("hobbies", [])
        hobbies = ", ".join(hobbies_list[:2]) if hobbies_list else "reading and traveling"

        fallback_by_tone = {
            "warm_balanced": [
                f"Hi, I'm {name}. I work as a {occ} {comp} and enjoy {hobbies} during my free time. Raised with close family values, I look forward to building a happy, balanced life together.",
                f"Hello, I'm {name}. Balancing my work as a {occ} {comp} with passions like {hobbies} keeps me grounded. Hoping to connect with someone genuine to share a joyful life journey."
            ],
            "modern_professional": [
                f"Hello, I'm {name}. Working as a {occ} {comp}, I'm driven by ambition and continuous growth. Outside work, I enjoy {hobbies} and value an equal partnership built on mutual respect.",
                f"Hi, I'm {name}, a {occ} {comp}. I value independence, active pursuits like {hobbies}, and modern thinking. Looking for an ambitious partner ready to grow together."
            ],
            "traditional_cultural": [
                f"Hi, I'm {name}. Blessed with strong family roots and cultural values, I work as a {occ} {comp}. In my free time, I enjoy {hobbies}. I look forward to building a happy family together.",
                f"Hello, I'm {name}. Raised with deep respect for traditions and family values, I work as a {occ} {comp} and love {hobbies}. Seeking a cultured partner to share life's sacred journey."
            ],
            "heartfelt_direct": [
                f"Hi, I'm {name}. Good conversations, {hobbies}, and honest connections make me happiest. While I work as a {occ} {comp}, I value warmth and openness above all. Hoping for a genuine connection.",
                f"Hello! I'm {name}, a {occ} {comp}. Off work, you'll find me {hobbies}. I believe in simple honesty and mutual comfort. Looking for someone true to themselves to share real companionship."
            ]
        }

        options = fallback_by_tone.get(canonical_tone, fallback_by_tone["warm_balanced"])
        selected_fallback = (
            next((v for v in options if v != previous_bio), options[1 % len(options)])
            if previous_bio
            else options[0]
        )

        return {
            "success": True,
            "source": "smart_fallback",
            "tone": canonical_tone,
            "summary": selected_fallback,
            "suggestions": [selected_fallback, *AI_SUGGESTIONS_DATABASE["summary"]]
        }

    if req_type not in AI_SUGGESTIONS_DATABASE:
        return {"error": "Invalid AI prompt type"}

    return {
        "success": True,
        "type": req_type,
        "suggestions": AI_SUGGESTIONS_DATABASE[req_type]
    }
