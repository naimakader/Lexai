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

| Persona     | Role             | Behavior                                                        |
| ----------- | ---------------- | --------------------------------------------------------------- |
| Judge       | Presiding        | Evaluates arguments, asks follow-up questions, issues rulings   |
| Prosecution | Opposing counsel | Counters every argument aggressively                            |
| Witness     | On the stand     | Answers questions, stays consistent, stumbles on contradictions |
| You         | Defense          | Argue your case, cite precedents, cross-examine the witness     |

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
- Defense turns and witness turns tracked and labeled separately
- Best argument highlighted with a star badge
- Full argument timeline with score delta per turn
- Replay any past session at any time from session history

### Shareable Session Cards

- Beautiful share page generated for every completed session
- Dynamic OG image generated using Next.js Edge Runtime
- One-click copy share link
- LinkedIn and Twitter share buttons with pre-filled text
- Preview the share image before posting

### Professor Dashboard

- Professors activate a dedicated dashboard with one click
- Create classes and get auto-generated join codes
- Students join classes using the join code
- Assign specific cases to a class with optional due dates
- Track every student's sessions, scores, and completion rate
- Class overview shows assignment completion progress per case
- Average score per assignment calculated automatically

### Loading Skeletons

- Shimmer skeleton cards on dashboard while cases load
- Shimmer skeleton cards on sessions page while history loads
- React Suspense boundaries for streaming server components
- Zero layout shift — skeletons match exact dimensions of real content

### Authentication and Persistence

- Clerk authentication with email and Google
- Role-based access — student and professor roles
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
| OG Images  | Vercel OG                      | Dynamic social share images on the edge           |
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

create table profiles (
  id text primary key,
  email text,
  role text default 'student',
  created_at timestamp with time zone default timezone('utc', now())
);

create table classes (
  id uuid default gen_random_uuid() primary key,
  professor_id text not null,
  name text not null,
  join_code text unique not null,
  created_at timestamp with time zone default timezone('utc', now())
);

create table class_members (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references classes(id) on delete cascade,
  student_id text not null,
  joined_at timestamp with time zone default timezone('utc', now())
);

create table assignments (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references classes(id) on delete cascade,
  case_id text not null,
  case_title text not null,
  due_date text,
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

create table profiles (
  id text primary key,
  email text,
  role text default 'student',
  created_at timestamp with time zone default timezone('utc', now())
);

create table classes (
  id uuid default gen_random_uuid() primary key,
  professor_id text not null,
  name text not null,
  join_code text unique not null,
  created_at timestamp with time zone default timezone('utc', now())
);

create table class_members (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references classes(id) on delete cascade,
  student_id text not null,
  joined_at timestamp with time zone default timezone('utc', now())
);

create table assignments (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references classes(id) on delete cascade,
  case_id text not null,
  case_title text not null,
  due_date text,
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
│   │   ├── witness/
│   │   │   └── route.ts
│   │   ├── professor/
│   │   │   └── route.ts
│   │   └── og/
│   │       └── route.tsx
│   ├── case/
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── CourtroomClient.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── DashboardClient.tsx
│   ├── professor/
│   │   ├── page.tsx
│   │   └── ProfessorClient.tsx
│   ├── sessions/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── share/
│   │           ├── page.tsx
│   │           └── ShareClient.tsx
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
- [x] Shareable session cards with dynamic OG image generation
- [x] Professor dashboard with class management and student analytics
- [x] Real-time multiplayer battle mode with Supabase Realtime
- [x] Loading skeletons with shimmer animation on all data pages- [ ] 200 plus landmark cases
- [ ] Mobile app

---

## Why This Project Stands Out

Most portfolio projects are todo apps or weather dashboards. LexAI is different.

**Real problem.** 1.8 million law students globally have no affordable way to practice oral arguments. This solves that directly.

**Technical depth.** Multi-persona AI state management, structured JSON outputs, real-time scoring, session persistence, replay timelines, witness contradiction detection, dynamic OG image generation, and role-based professor dashboard. This is not a tutorial project.

**Product thinking.** Every feature was designed around user behavior. The replay timeline exists because students need to know which argument won or lost the case. The witness mode exists because cross-examination is a completely different skill. The professor dashboard exists because adoption happens through institutions not individuals.

**Scalable architecture.** Server components for data fetching, client components for interactivity, API routes for AI calls, Supabase for persistence, edge runtime for OG images, role-based access control throughout. Clean separation of concerns.

---

## Built By

**Naima** — Frontend developer building products that matter.

GitHub: [@naimakader](https://github.com/naimakader)

---

## License

MIT — use it, learn from it, build on it.
