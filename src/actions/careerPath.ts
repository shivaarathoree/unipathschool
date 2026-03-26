import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// Function to safely extract keys from .env directly, mitigating cache issues
function getApiKey(key: string) {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.join(process.cwd(), '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const match = envFile.match(new RegExp(`^${key}=(.*)$`, 'm'));
    if (match && match[1]) {
      return match[1].trim().replace(/^['"]|['"]$/g, '');
    }
  } catch (e) { }
  return "";
}

// Simple fetch to Groq as fallback
async function generateRoadmapWithGroq(prompt: string) {
  const apiKey = getApiKey("GROQ_API_KEY");
  if (!apiKey) throw new Error("Groq API key not configured");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant", // Reliable schema model
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API responded with status ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content received from Groq");
  }

  const cleanJson = content.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleanJson);
}

export async function generateCareerRoadmap(answers: any, firebaseUid: string) {

  // 1. Generate Prompt
  const prompt = `You are an expert career counselor. Create a highly actionable 6-month personalized career roadmap in exactly 500 words or less.
**User Profile:**
- Target Career Field: ${answers.careerField}
- Current Education Level: ${answers.educationYear}
- General Skill Level: ${answers.skillLevel}
- Available Time: ${answers.timeCommitment} / week
- Ultimate Goal: ${answers.careerGoal}
- Has Portfolio: ${answers.hasPortfolio}
- Top Challenge: ${answers.biggestChallenge}

**Return the masterplan strictly in this EXACT JSON structure:**
{
  "careerField": "${answers.careerField}",
  "overallStrategy": "Write a 2-3 sentence personalized strategy summary focusing on their immediate needs and long-term goal.",
  "monthlyPlan": [
    {
      "month": 1,
      "title": "Month 1: Foundation Building",
      "focus": "What is the core theme of this month?",
      "skills": ["Exact Skill 1", "Exact Skill 2"],
      "projects": ["Build XYZ to demonstrate skills"]
    },
    {
      "month": 2,
      "title": "Month 2: Skill Development",
      "focus": "Theme for month 2",
      "skills": ["Skill 3", "Skill 4"],
      "projects": ["Build ABC app or portfolio piece"]
    },
    {
      "month": 3,
      "title": "Month 3: Advanced Concepts",
      "focus": "Theme for month 3",
      "skills": ["Skill 5", "Skill 6"],
      "projects": ["Real-world project example"]
    },
    {
      "month": 4,
      "title": "Month 4: Niche Specialization",
      "focus": "Theme for month 4",
      "skills": ["Skill 7", "Skill 8"],
      "projects": ["Complex project example"]
    },
    {
      "month": 5,
      "title": "Month 5: Portfolio Polish & Personal Branding",
      "focus": "Theme for month 5",
      "skills": ["Docs/Git", "Soft Skills"],
      "projects": ["Portfolio Website v1 or Open Source contribution"]
    },
    {
      "month": 6,
      "title": "Month 6: The Full Sprint To Target",
      "focus": "Theme for month 6",
      "skills": ["Interviewing", "Networking"],
      "projects": ["Apply to 20 highly targeted roles"]
    }
  ],
  "resumeTips": ["Specific resume tip 1", "Specific resume tip 2", "Specific resume tip 3"],
  "linkedInStrategy": ["Specific LinkedIn tip 1", "Specific LinkedIn tip 2", "Specific LinkedIn tip 3"]
}

Constraints: Output must be PERFECT parsing standard JSON. No markdown ticks outside the JSON string if sending raw string. Be extremely specific to ${answers.careerField}. Avoid generic advice. Use exact tech stacks (e.g. React/Node instead of "Learn frontend").`;

  let roadmap = null;

  // 2. Try Gemini using Google Generative AI SDK
  try {
    const geminiApiKey = getApiKey("GEMINI_API_KEY") || getApiKey("NEXT_PUBLIC_GEMINI_API_KEY");
    if (!geminiApiKey) throw new Error("Gemini API key is missing");
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
    roadmap = JSON.parse(cleanJson);
    console.log("✅ Successfully generated roadmap using Gemini SDK");
  } catch (err: any) {
    console.error("❌ Gemini failed:", err?.message || "Unknown error");

    // 3. Fallback to Groq
    try {
      roadmap = await generateRoadmapWithGroq(prompt);
      console.log("✅ Successfully generated roadmap using Groq Fallback");
    } catch (groqErr: any) {
      console.error("❌ Groq failed:", groqErr?.message || "Unknown error");
      throw new Error(`Both AI services failed. Gemini: ${err.message}. Groq: ${groqErr.message}`);
    }
  }

  return { roadmap };
}
