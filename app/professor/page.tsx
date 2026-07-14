import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ProfessorClient from "./ProfessorClient";
export default async function ProfessorPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  const { data: classes } = await supabaseAdmin
    .from("classes")
    .select("*")
    .eq("professor_id", userId)
    .order("created_at", { ascending: false });

  const classIds = classes?.map((c) => c.id) || [];

  const { data: members } =
    classIds.length > 0
      ? await supabaseAdmin
          .from("class_members")
          .select("*")
          .in("class_id", classIds)
      : { data: [] };

  const studentIds = [...new Set(members?.map((m) => m.student_id) || [])];

  const { data: studentSessions } =
    studentIds.length > 0
      ? await supabaseAdmin
          .from("sessions")
          .select("*")
          .in("user_id", studentIds)
          .order("created_at", { ascending: false })
      : { data: [] };

  const { data: assignments } =
    classIds.length > 0
      ? await supabaseAdmin
          .from("assignments")
          .select("*")
          .in("class_id", classIds)
          .order("created_at", { ascending: false })
      : { data: [] };

  return (
    <ProfessorClient
      userId={userId}
      profile={profile}
      classes={classes || []}
      members={members || []}
      studentSessions={studentSessions || []}
      assignments={assignments || []}
    />
  );
}
