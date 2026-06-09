import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ShareClient from "./ShareClient";

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (!session) redirect("/sessions");

  return <ShareClient session={session} />;
}
