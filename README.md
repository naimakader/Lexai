# LexAI — AI-Powered Courtroom Simulator

> Argue real landmark cases against an AI judge, prosecutor, and witness. Get scored on every argument. Built for the 1.8 million law students who can't afford a $500/hr moot court coach.

![LexAI](https://img.shields.io/badge/LexAI-Courtroom%20Simulator-6366F1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai)

---

## The Problem

Moot court is how law students learn to argue. The problem:

- A professional coach costs **$500 per hour**
- Most law schools offer **fewer than 12 practice sessions per year**
- Students who cannot afford coaching **lose more cases**
- There is **no free intelligent alternative** — until now

---

## What LexAI Does

LexAI puts you in a real courtroom simulation. You argue as the defense. Three AI personas respond to every argument you make:

| Persona     | Role             | Behavior                                                                |
| ----------- | ---------------- | ----------------------------------------------------------------------- |
| Judge       | Presiding        | Evaluates arguments, asks follow-up questions, issues rulings           |
| Prosecution | Opposing counsel | Counters every argument aggressively                                    |
| Witness     | On the stand     | Answers questions, tries to stay consistent, stumbles on contradictions |
| You         | Defense          | Argue your case, cite precedents, cross-examine the witness             |

After each session a replay timeline shows:

- Your score on every single argument
- Where your score went up and where it dropped
- Your best argument highlighted with a badge
- A full argument-by-argument breakdown with score delta

---

## Features

### Courtroom Simulator

- 3 real landmark cases included — Miranda, contract breach, self-defense
- AI judge and prosecutor respond dynamically to your exact arguments
- Real-time argument scoring from 0 to 100 on logic, precedent, and persuasiveness
- Live coaching feedback after every turn

### Witness Cross-Examination

- Switch to cross-examination mode inside any case with one click
- AI witness stays consistent with original testimony across the entire session
- Contradiction detection — catch the witness in a lie and get a score bonus
- Contradiction banner flashes when you successfully expose an inconsistency
- Green color system clearly separates witness mode from defense mode
- Coaching feedback after every question

### Session Replay Timeline

- Every session saved automatically to Supabase
- Visual score progression bar chart showing every turn
- Best argument highlighted with a star badge
- Full argument timeline with score delta per turn showing plus or minus
- Replay any past session at any time from session history
- Defense and witness turns tracked separately in the same session

### Authentication and Persistence

- Clerk authentication with email and Google
- Every session tied to the signed-in user
- Sessions ordered by date and accessible from the dashboard

### Professional UI

- FAANG-level dark design system
- Framer Motion animations on landing page
- Color-coded personas — Judge yellow, Prosecution red, Witness green, Defense blue
- Fully responsive across all screen sizes
- Blur backdrop navigation bars

---

## Tech Stack

| Layer      | Technology                     | Why                                               |
| ---------- | ------------------------------ | ------------------------------------------------- |
| Framework  | Next.js 15 App Router          | Server components, API routes, file-based routing |
| Language   | TypeScript                     | Type safety across the entire codebase            |
| Styling    | Tailwind CSS and inline styles | Utility-first with custom design tokens           |
| Auth       | Clerk                          | Production-grade authentication with zero config  |
| Database   | Supabase PostgreSQL            | Real-time, scalable, generous free tier           |
| AI         | OpenAI GPT-4o-mini             | Fast, cost-efficient, structured JSON outputs     |
| Animations | Framer Motion                  | Smooth page and component transitions             |
| Deployment | Vercel                         | Edge network, instant deploys from GitHub         |

---

## Database Schema

```sql
create table sessions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  case_title text not null,
  messages jsonb default '[]',
  score integer default 0,
  score_history jsonb default '[]',
  best_argument text default '',
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc', now())
);
```

---

## Getting Started

### Prerequisites

- Node.js 20 or higher
- Accounts on Clerk, Supabase, and OpenAI

### Installation

```bash
git clone https://github.com/naimakader/Lexai.git
cd Lexai
npm install
cp .env.example .env.local
npm run dev
```

### Environment Variables

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# OpenAI
OPENAI_API_KEY=sk-...
```

### Supabase Setup

Run this in your Supabase SQL editor:

```sql
create table sessions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  case_title text not null,
  messages jsonb default '[]',
  score integer default 0,
  score_history jsonb default '[]',
  best_argument text default '',
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc', now())
);
```

---

## Project Structure

```
lexai/
├── app/
│   ├── api/
│   │   ├── courtroom/
│   │   │   └── route.ts
│   │   └── witness/
│   │       └── route.ts
│   ├── case/
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── CourtroomClient.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── DashboardClient.tsx
│   ├── sessions/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── sign-in/[[...sign-in]]/
│   │   └── page.tsx
│   ├── sign-up/[[...sign-up]]/
│   │   └── page.tsx
│   ├── clerk-theme.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── supabase.ts
├── middleware.ts
├── .env.example
└── README.md
```

---

## Roadmap

- [x] Core courtroom simulator
- [x] 3 AI personas — judge, prosecution, defense
- [x] Real-time argument scoring
- [x] Session history page
- [x] Session replay with score timeline and bar chart
- [x] AI witness cross-examination with contradiction detection
- [ ] Shareable session cards
- [ ] Professor dashboard for assigning cases to students
- [ ] 200 plus landmark cases
- [ ] Mobile app

---

## Why This Project Stands Out

Most portfolio projects are todo apps or weather dashboards. LexAI is different.

**Real problem.** 1.8 million law students globally have no affordable way to practice oral arguments. This solves that directly.

**Technical depth.** Multi-persona AI state management, structured JSON outputs, real-time scoring, session persistence, replay timelines, and witness contradiction detection. This is not a tutorial project.

**Product thinking.** Every feature was designed around user behavior. The replay timeline exists because students need to know which argument won or lost the case. The witness mode exists because cross-examination is a completely different skill from opening arguments.

**Scalable architecture.** Server components for data fetching, client components for interactivity, API routes for AI calls, Supabase for persistence. Clean separation of concerns throughout.

---

## Built By

**Naima** — Frontend developer building products that matter.

GitHub: [@naimakader](https://github.com/naimakader)

---

## License

MIT — use it, learn from it, build on it.
