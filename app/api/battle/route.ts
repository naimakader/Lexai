import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function generateJoinCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action, caseId, caseTitle, joinCode, message, roomId, role } =
    await req.json();

  if (action === "create_room") {
    const code = generateJoinCode();
    const { data, error } = await supabase
      .from("battle_rooms")
      .insert({
        case_id: caseId,
        case_title: caseTitle,
        player1_id: userId,
        player1_role: "defense",
        player2_role: "prosecution",
        status: "waiting",
        join_code: code,
      })
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ room: data });
  }

  if (action === "join_room") {
    const { data: room } = await supabase
      .from("battle_rooms")
      .select("*")
      .eq("join_code", joinCode.toUpperCase())
      .single();

    if (!room)
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    if (room.player2_id)
      return NextResponse.json({ error: "Room is full" }, { status: 400 });
    if (room.player1_id === userId)
      return NextResponse.json(
        { error: "Cannot join your own room" },
        { status: 400 },
      );

    const { data, error } = await supabase
      .from("battle_rooms")
      .update({ player2_id: userId, status: "active" })
      .eq("id", room.id)
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ room: data });
  }

  if (action === "send_message") {
    const { data: room } = await supabase
      .from("battle_rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (!room)
      return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const isPlayer1 = room.player1_id === userId;
    const playerRole = isPlayer1 ? room.player1_role : room.player2_role;

    const newMessage = {
      role: playerRole,
      content: message,
      userId,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...(room.messages || []), newMessage];

    const facts = getCaseFacts(room.case_id);

    const conversation = updatedMessages
      .map(
        (m: any) =>
          `${m.role === "defense" ? "Defense" : "Prosecution"}: ${m.content}`,
      )
      .join("\n");

    const prompt = `
You are an AI judge presiding over a courtroom battle between two students.

Case: ${room.case_title}
Facts: ${facts}

Argument exchange so far:
${conversation}

The ${playerRole} just argued: "${message}"

Respond with a JSON object with exactly these 5 fields:
- judgeResponse: Your ruling or reaction as the judge (1-2 sentences, formal, address both sides)
- defenseScore: Updated score for defense from 0 to 100
- prosecutionScore: Updated score for prosecution from 0 to 100
- feedback: One sentence of feedback directed at the ${playerRole}
- winner: null if game is ongoing, "defense" or "prosecution" if one side has clearly won after 6+ exchanges

Return only valid JSON. No extra text.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    const judgeMessage = {
      role: "judge",
      content: result.judgeResponse,
      userId: "judge",
      timestamp: new Date().toISOString(),
    };

    const finalMessages = [...updatedMessages, judgeMessage];

    await supabase
      .from("battle_rooms")
      .update({
        messages: finalMessages,
        player1_score: result.defenseScore,
        player2_score: result.prosecutionScore,
        status: result.winner ? "completed" : "active",
      })
      .eq("id", roomId);

    return NextResponse.json({
      judgeResponse: result.judgeResponse,
      defenseScore: result.defenseScore,
      prosecutionScore: result.prosecutionScore,
      feedback: result.feedback,
      winner: result.winner,
      messages: finalMessages,
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

function getCaseFacts(caseId: string) {
  const facts: Record<string, string> = {
    miranda:
      "The defendant was arrested and interrogated for 2 hours without being told his rights. He signed a confession. The prosecution wants to use it as evidence.",
    "contract-breach":
      "DevStudio was hired to build a web app in 3 months for $50,000. They delivered 6 weeks late due to unclear requirements from TechCorp. TechCorp is suing for $200,000.",
    selfdefense:
      "The defendant punched another man outside a bar. Witnesses say the other man approached aggressively and made verbal threats first. The defendant has no prior record.",
  };
  return facts[caseId] || "No facts available.";
}
