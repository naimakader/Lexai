import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { caseData, messages } = await req.json();

  const conversation = messages
    .map((m: { role: string; content: string }) => {
      const role =
        m.role === "user"
          ? "Defense"
          : m.role === "judge"
            ? "Judge"
            : "Prosecution";
      return `${role}: ${m.content}`;
    })
    .join("\n");

  const prompt = `
You are running a courtroom simulation.

Case facts: ${caseData.facts}

Conversation so far:
${conversation}

Respond with a JSON object with exactly these 5 fields:
- judgeResponse: The judge's response to the defense's last argument (1-2 sentences, formal)
- prosecutionResponse: The prosecution's counter-argument (1-2 sentences, aggressive)
- score: A number from 0 to 100 rating how strong the defense's last argument was
- scoreDelta: A number showing how much the score changed from the previous turn (positive or negative)
- feedback: One short sentence of coaching feedback for the defense

Return only valid JSON. No extra text.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(completion.choices[0].message.content || "{}");
  return NextResponse.json(result);
}
