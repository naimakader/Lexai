import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { caseData, witnessMessages, messages, scoreHistory, currentInput } = await req.json()
  const lastMessage = witnessMessages[witnessMessages.length - 1]
  if (!lastMessage?.content || lastMessage.content.length > 1000) {
    return NextResponse.json(
      { error: "Invalid input. Keep questions under 1000 characters." },
      { status: 400 }
    )
  }

  const conversation = witnessMessages
    .map((m: { role: string; content: string }) => {
      const role = m.role === "user" ? "Attorney" : "Witness"
      return `${role}: ${m.content}`
    })
    .join("\n")

  const prompt = `
You are playing the role of a witness in a courtroom cross-examination.

Your identity: ${caseData.witness.name}, ${caseData.witness.role}
Your original testimony: ${caseData.witness.testimony}
Case facts: ${caseData.facts}

IMPORTANT RULES:
- Stay consistent with your original testimony unless the attorney asks a very clever question
- If caught in a contradiction admit it reluctantly
- Be evasive and defensive when pressed
- Respond in 1-3 sentences maximum

Cross-examination so far:
${conversation}

Respond with a JSON object with exactly these 5 fields:
- witnessResponse: Your response as the witness (1-3 sentences)
- contradiction: true if the attorney caught a contradiction, false otherwise
- score: A number from 0 to 100 rating how effective the last question was
- scoreDelta: How much the score changed (positive or negative)
- feedback: One short sentence coaching the attorney

Return only valid JSON. No extra text.
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  })

  const result = JSON.parse(completion.choices[0].message.content || "{}")

  const newEntry = {
    turn: (scoreHistory?.length || 0) + 1,
    score: result.score,
    argument: currentInput,
    delta: result.scoreDelta || 0,
    mode: "witness",
  }

  const updatedHistory = [...(scoreHistory || []), newEntry]

  const bestArgument = updatedHistory.reduce(
    (best: any, entry: any) =>
      entry.score > (best?.score ?? 0) ? entry : best,
    updatedHistory[0]
  )

  // Check if session already exists for this user and case
  const { data: existing } = await supabaseAdmin
    .from("sessions")
    .select("id")
    .eq("user_id", userId)
    .eq("case_title", caseData.title)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (existing?.id) {
    await supabaseAdmin
      .from("sessions")
      .update({
        messages: messages || [],
        score: result.score,
        score_history: updatedHistory,
        best_argument: bestArgument?.argument || "",
        completed: true,
      })
      .eq("id", existing.id)
  } else {
    await supabaseAdmin
      .from("sessions")
      .insert({
        user_id: userId,
        case_title: caseData.title,
        messages: messages || [],
        score: result.score,
        score_history: updatedHistory,
        best_argument: bestArgument?.argument || "",
        completed: true,
      })
  }

  return NextResponse.json({
    ...result,
    updatedHistory,
  })
}