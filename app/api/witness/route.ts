import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { caseData, witnessMessages } = await req.json();

  const conversation = witnessMessages
    .map((m: { role: string; content: string }) => {
      const role = m.role === "user" ? "Attorney" : "Witness";
      return `${role}: ${m.content}`;
    })
    .join("\n");

  const prompt = `
You are playing the role of a witness in a courtroom cross-examination.

Your identity: ${caseData.witness.name}, ${caseData.witness.role}
Your original testimony: ${caseData.witness.testimony}
Case facts: ${caseData.facts}

IMPORTANT RULES:
- Stay consistent with your original testimony unless the attorney asks a very clever question that exposes a contradiction
- If the attorney catches you in a contradiction, admit it reluctantly but try to explain it away
- Be evasive, nervous, or defensive when pressed on weak points
- Never volunteer information the attorney did not ask for
- Respond in 1-3 sentences maximum as a real witness would

Cross-examination so far:
${conversation}

Respond with a JSON object with exactly these 5 fields:
- witnessResponse: Your response as the witness (1-3 sentences, realistic, defensive or evasive)
- contradiction: true if the attorney successfully caught a contradiction in your testimony, false otherwise
- score: A number from 0 to 100 rating how effective the attorney's last question was
- scoreDelta: How much the score changed from the previous turn (positive or negative)
- feedback: One short sentence coaching the attorney on their cross-examination technique

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
