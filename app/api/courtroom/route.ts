import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { caseData, messages, scoreHistory, currentInput } = await req.json();

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage?.content || lastMessage.content.length > 1000) {
    return NextResponse.json(
      { error: "Invalid input. Keep arguments under 1000 characters." },
      { status: 400 },
    );
  }

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

  const newEntry = {
    turn: (scoreHistory?.length || 0) + 1,
    score: result.score,
    argument: currentInput,
    delta: result.scoreDelta || 0,
    mode: "defense",
  };

  const updatedHistory = [...(scoreHistory || []), newEntry];

  const updatedMessages = [
    ...messages,
    { role: "judge", content: result.judgeResponse },
    { role: "prosecution", content: result.prosecutionResponse },
  ];

  const bestArgument = updatedHistory.reduce(
    (best: any, entry: any) =>
      entry.score > (best?.score ?? 0) ? entry : best,
    updatedHistory[0],
  );

  // Check if session already exists for this user and case
  const { data: existing } = await supabaseAdmin
    .from("sessions")
    .select("id")
    .eq("user_id", userId)
    .eq("case_title", caseData.title)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (existing?.id) {
    await supabaseAdmin
      .from("sessions")
      .update({
        messages: updatedMessages,
        score: result.score,
        score_history: updatedHistory,
        best_argument: bestArgument?.argument || "",
        completed: true,
      })
      .eq("id", existing.id);
  } else {
    await supabaseAdmin.from("sessions").insert({
      user_id: userId,
      case_title: caseData.title,
      messages: updatedMessages,
      score: result.score,
      score_history: updatedHistory,
      best_argument: bestArgument?.argument || "",
      completed: true,
    });
  }

  return NextResponse.json({
    ...result,
    updatedMessages,
    updatedHistory,
  });
}
