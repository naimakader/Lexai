import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import BattleLobby from "./BattleLobby";

export default async function BattlePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <BattleLobby userId={userId} />;
}
