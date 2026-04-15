import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { industry, experience, skills } = body;

        const geminiApiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const groqApiKey = process.env.GROQ_API_KEY;

        const prompt = `You are an expert career counselor and industry analyst.
Based on the following user profile:
- Industry: ${industry || "Technology"}
- Experience: ${experience || "1"} years
- Current Skills: ${(skills && skills.length) ? skills.join(", ") : "None"}

Provide a highly accurate, brief output containing exactly:
1. 6 "Key Industry Trends" happening right now in their specific industry.
2. 6 "Recommended Skills" they should learn next to advance their career.

Return the result STRICTLY as a JSON object with this shape, and no other markdown or text:
{
  "trends": ["trend 1", "trend 2", "trend 3", "trend 4", "trend 5", "trend 6"],
  "recommendedSkills": ["skill 1", "skill 2", "skill 3", "skill 4", "skill 5", "skill 6"]
}
`;

        let parsedResponse = null;

        // Attempt 1: Gemini
        if (geminiApiKey) {
            try {
                const geminiResponse = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: { responseMimeType: "application/json" },
                        }),
                    }
                );

                if (geminiResponse.ok) {
                    const data = await geminiResponse.json();
                    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (textResponse) {
                        try {
                            parsedResponse = JSON.parse(textResponse);
                        } catch (e) {
                            console.error("Failed to parse Gemini JSON", e);
                        }
                    }
                } else {
                    console.warn(`Gemini API failed with status ${geminiResponse.status}`);
                }
            } catch (err) {
                console.error("Gemini attempt failed:", err);
            }
        }

        // Attempt 2: Groq Fallback
        if (!parsedResponse && groqApiKey) {
            console.log("Using Groq API as Fallback...");
            try {
                const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${groqApiKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [{ role: "user", content: prompt }],
                        response_format: { type: "json_object" }
                    })
                });

                if (groqResponse.ok) {
                    const data = await groqResponse.json();
                    const content = data.choices?.[0]?.message?.content;
                    if (content) {
                        try {
                            parsedResponse = JSON.parse(content);
                        } catch (e) {
                            console.error("Failed to parse Groq JSON", e);
                        }
                    }
                } else {
                    const errText = await groqResponse.text();
                    console.error(`Groq API failed with status ${groqResponse.status}: ${errText}`);
                }
            } catch (err) {
                console.error("Groq attempt failed:", err);
            }
        }

        if (!parsedResponse) {
            throw new Error("Both Gemini and Groq AI providers failed to generate insights");
        }

        return NextResponse.json(parsedResponse);

    } catch (error: any) {
        console.error("Error fetching insights:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to fetch insights" },
            { status: 500 }
        );
    }
}
