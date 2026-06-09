import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourtroomClient from "./CourtroomClient";

const cases: Record<
  string,
  {
    title: string;
    description: string;
    type: string;
    facts: string;
    witness: {
      name: string;
      role: string;
      testimony: string;
    };
  }
> = {
  miranda: {
    title: "State v. Miranda",
    type: "Criminal",
    description: "Argue that your client's confession should be suppressed.",
    facts:
      "The defendant was arrested and interrogated for 2 hours. He was never told he had the right to remain silent or the right to an attorney. He signed a confession. The prosecution wants to use it as evidence.",
    witness: {
      name: "Officer Daniel Hayes",
      role: "Arresting Officer",
      testimony:
        "I arrested the defendant at 9pm. We brought him to the station and he was cooperative. He signed the confession willingly after about two hours. I was present the entire time. Everything was done by the book.",
    },
  },
  "contract-breach": {
    title: "TechCorp v. DevStudio",
    type: "Civil",
    description: "Defend your client against a breach of contract claim.",
    facts:
      "DevStudio was hired to build a web app in 3 months for $50,000. They delivered 6 weeks late due to unclear requirements from TechCorp. TechCorp is suing for $200,000 in lost revenue.",
    witness: {
      name: "Marcus Reid",
      role: "TechCorp Project Manager",
      testimony:
        "We gave DevStudio complete requirements on day one. The contract was clear — three months, full delivery. They missed the deadline by six weeks with no valid excuse. Our requirements never changed throughout the project.",
    },
  },
  selfdefense: {
    title: "State v. Johnson",
    type: "Criminal",
    description: "Prove your client acted in self-defense.",
    facts:
      "The defendant punched another man outside a bar. Witnesses say the other man approached aggressively and made verbal threats first. The defendant has no prior record.",
    witness: {
      name: "Brian Cole",
      role: "Eyewitness",
      testimony:
        "I saw everything clearly. Johnson just walked up and punched the other guy out of nowhere. There were no threats beforehand. It was completely unprovoked. I was standing right there the whole time.",
    },
  },
};

export default async function CasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const caseData = cases[id];
  if (!caseData) redirect("/dashboard");

  return <CourtroomClient caseData={caseData} caseId={id} userId={userId} />;
}
