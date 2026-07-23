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
  "brown-v-board": {
    title: "Brown v. Board of Education",
    type: "Constitutional",
    description:
      "Argue that racial segregation in public schools is unconstitutional.",
    facts:
      "Linda Brown, a Black student, was denied admission to an all-white elementary school in Topeka, Kansas. She was forced to travel far to attend a Black school. The school board argues separate but equal facilities are constitutional under Plessy v. Ferguson 1896.",
    witness: {
      name: "Dr. Kenneth Clark",
      role: "Psychologist and Expert Witness",
      testimony:
        "I conducted doll tests with Black children. They consistently preferred white dolls and associated negative traits with Black dolls. This demonstrates that segregation causes severe psychological harm to Black children and damages their self-esteem.",
    },
  },
  "roe-v-wade": {
    title: "Roe v. Wade",
    type: "Constitutional",
    description:
      "Defend a woman's constitutional right to privacy in medical decisions.",
    facts:
      "Jane Roe challenges a Texas law criminalizing abortion except to save the mother's life. The state argues it has a compelling interest in protecting potential life. Roe argues the law violates her right to privacy under the Fourteenth Amendment.",
    witness: {
      name: "Dr. Sarah Matthews",
      role: "OB-GYN and Medical Expert",
      testimony:
        "Criminalizing abortion does not stop abortions. It only makes them dangerous. Women who cannot access safe procedures face life-threatening complications. The state law puts doctors in an impossible position between their medical duty and criminal liability.",
    },
  },
  "apple-v-samsung": {
    title: "Apple Inc. v. Samsung Electronics",
    type: "Intellectual Property",
    description: "Defend Samsung against Apple's patent infringement claims.",
    facts:
      "Apple claims Samsung copied the iPhone's design including rounded corners, grid of icons, and pinch-to-zoom gesture. Apple seeks over one billion dollars in damages. Samsung argues these features are functional not ornamental and therefore not protectable.",
    witness: {
      name: "Dr. James Park",
      role: "Samsung Lead Designer",
      testimony:
        "Our design process was completely independent. We had our own touchscreen research years before the iPhone. The features Apple claims as unique are functional necessities — you cannot have a touchscreen phone without touch gestures. We did not copy anyone.",
    },
  },
  "obergefell-v-hodges": {
    title: "Obergefell v. Hodges",
    type: "Constitutional",
    description:
      "Argue that same-sex couples have a constitutional right to marry.",
    facts:
      "Jim Obergefell married his terminally ill partner in Maryland. Ohio refused to recognize the marriage on his partner's death certificate. Obergefell argues Ohio's ban on same-sex marriage violates the Fourteenth Amendment's Due Process and Equal Protection clauses.",
    witness: {
      name: "Professor Linda Greene",
      role: "Constitutional Law Expert",
      testimony:
        "Marriage is a fundamental right recognized by the Supreme Court in over a dozen cases. The Court has never defined marriage as exclusively between a man and a woman for constitutional purposes. Denying same-sex couples this right serves no legitimate government interest.",
    },
  },
  "citizens-united": {
    title: "Citizens United v. FEC",
    type: "Constitutional",
    description:
      "Defend the right of corporations to spend on political speech.",
    facts:
      "Citizens United, a nonprofit, wanted to air a film critical of Hillary Clinton within 30 days of a primary election. The FEC blocked it under the Bipartisan Campaign Reform Act. Citizens United argues the law violates the First Amendment right to free speech.",
    witness: {
      name: "Professor David Strauss",
      role: "First Amendment Scholar",
      testimony:
        "The government cannot restrict political speech based on the speaker's identity. Corporations and unions are associations of people who have First Amendment rights. Limiting their ability to spend on political speech is a direct restriction on expression that the Constitution does not permit.",
    },
  },
  "mcdonald-v-chicago": {
    title: "McDonald v. City of Chicago",
    type: "Constitutional",
    description:
      "Argue that the Second Amendment applies to state and local governments.",
    facts:
      "Otis McDonald, a retired maintenance engineer, wanted to keep a handgun at home for self-defense in a high-crime neighborhood. Chicago's handgun ban prevented him. McDonald argues the Second Amendment right recognized in Heller applies to states through the Fourteenth Amendment.",
    witness: {
      name: "Professor Michael Torres",
      role: "Second Amendment Historian",
      testimony:
        "The Fourteenth Amendment was specifically designed to protect fundamental rights against state infringement. The right to keep arms for self-defense was understood as a fundamental right at the time of the Amendment's ratification in 1868. Chicago's total ban goes far beyond any historical tradition of gun regulation.",
    },
  },
  "enron-fraud": {
    title: "United States v. Skilling",
    type: "Criminal",
    description: "Defend Enron's CEO against securities fraud charges.",
    facts:
      "Jeffrey Skilling, former CEO of Enron, is charged with conspiracy and securities fraud. The government alleges he misled investors about Enron's financial health before its collapse wiped out billions in shareholder value. Skilling argues he believed in Enron's business model and had no intent to defraud.",
    witness: {
      name: "Richard Causey",
      role: "Former Enron Chief Accounting Officer",
      testimony:
        "The accounting methods we used were approved by our auditors at Arthur Andersen. Everything was disclosed in our financial statements. The business model was sound — the energy market collapse was unforeseeable. Jeff Skilling was not involved in hiding anything. He genuinely believed in the company.",
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
