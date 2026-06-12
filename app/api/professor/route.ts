import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
function generateJoinCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { action, className, joinCode, caseId, caseTitle, dueDate, classId } =
    await req.json();
  if (action === "become_professor") {
    await supabase.from("profiles").upsert({
      id: userId,
      role: "professor",
    });
    return NextResponse.json({ success: true });
  }

  if (action === "create_class") {
    const code = generateJoinCode();
    const { data, error } = await supabase
      .from("classes")
      .insert({
        professor_id: userId,
        name: className,
        join_code: code,
      })
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ class: data });
  }

  if (action === "join_class") {
    const { data: classData } = await supabase
      .from("classes")
      .select("*")
      .eq("join_code", joinCode.toUpperCase())
      .single();

    if (!classData)
      return NextResponse.json({ error: "Class not found" }, { status: 404 });

    await supabase.from("class_members").upsert({
      class_id: classData.id,
      student_id: userId,
    });

    await supabase.from("profiles").upsert({
      id: userId,
      role: "student",
    });

    return NextResponse.json({ class: classData });
  }

  if (action === "assign_case") {
    const { data, error } = await supabase
      .from("assignments")
      .insert({
        class_id: classId,
        case_id: caseId,
        case_title: caseTitle,
        due_date: dueDate || null,
      })
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ assignment: data });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
