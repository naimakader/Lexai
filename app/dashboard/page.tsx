import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

const cases = [
  {
    id: "miranda",
    type: "Criminal",
    title: "State v. Miranda",
    description:
      "Your client was interrogated without being informed of their rights. Argue the confession should be suppressed.",
  },
  {
    id: "contract-breach",
    type: "Civil",
    title: "TechCorp v. DevStudio",
    description:
      "A software company claims your client failed to deliver a product on time. Defend the breach of contract claim.",
  },
  {
    id: "selfdefense",
    type: "Criminal",
    title: "State v. Johnson",
    description:
      "Your client is charged with assault. You must prove the act was self-defense under the law.",
  },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#0a0a0b] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white">LexAI</h1>
            <p className="text-gray-500 text-sm mt-1">Courtroom Simulator</p>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>

        <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-4">
          Choose a Case
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {cases.map((c) => (
            <Link
              key={c.id}
              href={`/case/${c.id}`}
              className="block bg-[#111114] border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-full">
                    {c.type}
                  </span>
                  <h3 className="text-white font-semibold mt-3 mb-1 group-hover:text-blue-400 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {c.description}
                  </p>
                </div>
                <span className="text-gray-600 group-hover:text-white transition-colors ml-4 mt-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
