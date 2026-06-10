import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BattleRoom from "./BattleRoom";

export default async function BattleRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const { data: room } = await supabase
    .from("battle_rooms")
    .select("*")
    .eq("id", id)
    .single();

  if (!room) redirect("/battle");

  const isPlayer = room.player1_id === userId || room.player2_id === userId;
  if (!isPlayer) redirect("/battle");

  return <BattleRoom room={room} userId={userId} />;
}
