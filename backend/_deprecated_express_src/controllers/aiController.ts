import { Request, Response } from 'express';

const AI_SUGGESTIONS_DATABASE = {
  summary: [
    'I work as a Senior AI Engineer, where I focus on building intelligent products. Outside work, I love spending weekends exploring new cafes, reading fiction, and staying close with my family. Looking for someone genuine, cheerful, and understanding to build a happy life together.',
    'Working in corporate leadership keeps my days engaging, but I always make time for family dinners, classical music, and outdoor walks. I value mutual respect, warm conversations, and a lighthearted approach to life.',
    'Based in Mumbai, I lead product engineering teams. When I am off the clock, you will usually find me cooking, hitting the gym, or planning weekend getaways. Hoping to connect with a warm, family-minded partner.'
  ],
  expectations: [
    'Looking for a warm-hearted, progressive partner with strong family values, open communication, and mutual respect.',
    'Seeking an educated, independent, and understanding life partner who enjoys meaningful conversations and traveling.',
    'Hoping to connect with a compassionate partner who balances career ambitions with family life.'
  ],
  hobbies: [
    ['Reading', 'Travel', 'Photography', 'Gym', 'Meditation'],
    ['Cooking', 'Music', 'Movies', 'Yoga', 'Adventure'],
    ['Painting', 'Dance', 'Sports', 'Gaming', 'Reading']
  ]
};

const MASTER_SYSTEM_PROMPT = `You are an AI Wedding Biodata Bio Generator.

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
Output only the bio text.`;

const STYLE_DEFINITIONS: Record<string, { name: string; detail: string }> = {
  warm_balanced: {
    name: 'WARM & BALANCED',
    detail: 'Focus on personality, lifestyle, hobbies, career, family, and a balanced life. Keep it warm and approachable.'
  },
  modern_professional: {
    name: 'MODERN PROFESSIONAL',
    detail: 'Focus more on career, education, ambitions, independence, lifestyle, and modern relationship values. Keep it confident and contemporary.'
  },
  traditional_cultural: {
    name: 'TRADITIONAL & CULTURAL',
    detail: 'Focus more on family, values, upbringing, traditions, respect, and togetherness. Keep it graceful and sincere.'
  },
  heartfelt_direct: {
    name: 'HEARTFELT & DIRECT',
    detail: 'Focus on personality, emotions, companionship, happiness, and what the person genuinely wants in a relationship. Make it conversational and personal.'
  }
};

const TONE_ALIASES: Record<string, string> = {
  balanced: 'warm_balanced',
  warm: 'warm_balanced',
  warm_balanced: 'warm_balanced',
  professional: 'modern_professional',
  modern: 'modern_professional',
  modern_professional: 'modern_professional',
  traditional: 'traditional_cultural',
  cultural: 'traditional_cultural',
  traditional_cultural: 'traditional_cultural',
  romantic: 'heartfelt_direct',
  heartfelt: 'heartfelt_direct',
  direct: 'heartfelt_direct',
  heartfelt_direct: 'heartfelt_direct',
};

export const generateAiContent = async (req: Request, res: Response) => {
  const { type, userData, previousBio, model = 'llama3', tone = 'warm_balanced' } = req.body;
  const canonicalTone = TONE_ALIASES[String(tone).toLowerCase()] || 'warm_balanced';

  // Handle Ollama AI direct LLM generation request
  if (type === 'ollama_summary' || req.body.useOllama) {
    try {
      const mainEdu = userData?.educationList?.[0] || {};
      const degreeStr = mainEdu.degree || userData?.highestQualification || '';
      const collegeStr = mainEdu.college || '';
      const uniStr = mainEdu.university || '';

      const userDetailsText = `Name: ${userData?.name || ''}
Age: ${userData?.age || ''}
Gender: ${userData?.gender || ''}

Education:
- Degree: ${degreeStr}
- College: ${collegeStr}
- University: ${uniStr}

Career:
- Occupation: ${userData?.occupation || ''}
- Company: ${userData?.company || ''}
- Designation: ${userData?.designation || ''}
- Experience: ${userData?.experienceYears ? `${userData.experienceYears} years` : ''}

Family:
- Family Type: ${userData?.familyType || ''}
- Family Values: ${userData?.familyValues || ''}
- Native Place: ${userData?.nativePlace || ''}

Lifestyle:
- Diet: ${userData?.diet || ''}
- Smoking: ${userData?.smoking || ''}
- Drinking: ${userData?.drinking || ''}
- Hobbies: ${(userData?.hobbies || []).join(', ')}

Religion:
${userData?.religion || ''}

Caste:
${userData?.caste || ''}

Languages Known:
${(userData?.languagesKnown || []).join(', ')}

Partner Expectations:
- Expected Education: ${userData?.expectedEducation || ''}
- Expected Profession: ${userData?.expectedProfession || ''}
- Expected Location: ${userData?.expectedLocation || ''}
- Other Preferences: ${userData?.otherPreferences || ''}`;

      const style = STYLE_DEFINITIONS[canonicalTone] || STYLE_DEFINITIONS.warm_balanced;
      const systemInstruction = MASTER_SYSTEM_PROMPT
        .replace('{style_name}', style.name)
        .replace('{style_detail}', style.detail);

      let prompt = '';

      if (previousBio) {
        prompt = `${systemInstruction}

IMPORTANT: Generate a completely new version with different wording and sentence structure.
Previous version to avoid repeating:
${previousBio}

User Information:
${userDetailsText}

Generate the bio (maximum 3 lines, ~30–45 words) now:`;
      } else {
        prompt = `${systemInstruction}

User Information:
${userDetailsText}

Generate the bio (maximum 3 lines, ~30–45 words) now:`;
      }

      // Try contacting local Ollama instance (11434)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 second timeout

      const response = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: model,
          system: systemInstruction,
          prompt: prompt,
          stream: false,
        })
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json() as any;
        if (data && data.response) {
          const cleanSummary = data.response.trim().replace(/^["']|["']$/g, '');
          return res.status(200).json({
            success: true,
            source: 'ollama',
            model: model,
            tone: canonicalTone,
            summary: cleanSummary,
            suggestions: [cleanSummary, ...AI_SUGGESTIONS_DATABASE.summary],
          });
        }
      }
    } catch (e) {
      // Ollama not active locally -> Fallback gracefully to human-styled smart personalized generator
    }

    // Concise ~30–45 word fallback bios matching each style
    const name = userData?.name || 'Aarav';
    const occ = userData?.occupation || 'Software Professional';
    const comp = userData?.company ? `at ${userData.company}` : '';
    const hobbies = userData?.hobbies && userData.hobbies.length ? userData.hobbies.slice(0, 2).join(', ') : 'reading and traveling';

    const fallbackByTone: Record<string, string[]> = {
      warm_balanced: [
        `Hi, I'm ${name}. I work as a ${occ} ${comp} and enjoy ${hobbies} during my free time. Raised with close family values, I look forward to building a happy, balanced life together.`,
        `Hello, I'm ${name}. Balancing my work as a ${occ} ${comp} with passions like ${hobbies} keeps me grounded. Hoping to connect with someone genuine to share a joyful life journey.`
      ],
      modern_professional: [
        `Hello, I'm ${name}. Working as a ${occ} ${comp}, I'm driven by ambition and continuous growth. Outside work, I enjoy ${hobbies} and value an equal partnership built on mutual respect.`,
        `Hi, I'm ${name}, a ${occ} {comp}. I value independence, active pursuits like ${hobbies}, and modern thinking. Looking for an ambitious partner ready to grow together.`
      ],
      traditional_cultural: [
        `Hi, I'm ${name}. Blessed with strong family roots and cultural values, I work as a ${occ} ${comp}. In my free time, I enjoy ${hobbies}. I look forward to building a happy family together.`,
        `Hello, I'm ${name}. Raised with deep respect for traditions and family values, I work as a ${occ} ${comp} and love ${hobbies}. Seeking a cultured partner to share life's sacred journey.`
      ],
      heartfelt_direct: [
        `Hi, I'm ${name}. Good conversations, ${hobbies}, and honest connections make me happiest. While I work as a ${occ} ${comp}, I value warmth and openness above all. Hoping for a genuine connection.`,
        `Hello! I'm ${name}, a ${occ} ${comp}. Off work, you'll find me ${hobbies}. I believe in simple honesty and mutual comfort. Looking for someone true to themselves to share real companionship.`
      ]
    };

    const options = fallbackByTone[canonicalTone] || fallbackByTone.warm_balanced;
    const selectedFallback = previousBio && options.length > 1
      ? (options.find(v => v !== previousBio) || options[1])
      : options[0];

    return res.status(200).json({
      success: true,
      source: 'smart_fallback',
      tone: canonicalTone,
      summary: selectedFallback,
      suggestions: [selectedFallback, ...AI_SUGGESTIONS_DATABASE.summary],
    });
  }

  // Regular predefined suggestions
  if (!type || !AI_SUGGESTIONS_DATABASE[type as keyof typeof AI_SUGGESTIONS_DATABASE]) {
    return res.status(400).json({ success: false, message: 'Invalid AI prompt type' });
  }

  const suggestions = AI_SUGGESTIONS_DATABASE[type as keyof typeof AI_SUGGESTIONS_DATABASE];

  res.status(200).json({
    success: true,
    type,
    suggestions,
  });
};
