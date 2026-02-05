// FILE: app/cases/deadline-panic/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function DeadlinePanicCase() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-400">
              Case study
            </p>
            <h1 className="mt-2 text-3xl font-semibold">
              Deadline Panic — Visual workload intelligence for creative teams
            </h1>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              An urgency layer that reveals real blockers across tools, predicts risk,
              and keeps teams aligned without adding another heavy system.
            </p>
          </div>
          <button
            className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:border-emerald-400 hover:text-emerald-200 transition"
            onClick={() => router.push("/")}
          >
            ← Back to canvas
          </button>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-semibold text-emerald-400 mb-2">
              Problem
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Critical work gets buried across Jira, Notion, Slack, and Figma. Teams react
              to noise instead of signal, deadlines slip, and burnout risk rises.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-semibold text-emerald-400 mb-2">
              Solution
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              A real-time heatmap that ranks tasks by predicted impact and risk, pulls in
              presence signals, and centralizes quick actions like comments and file drops.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-400">
            Highlights
          </h3>
          <ul className="space-y-2 text-sm text-slate-300 leading-relaxed">
            <li>AI scoring per task to surface the 5 items that matter right now.</li>
            <li>Burnout indicator per assignee based on load, deadlines, and context switches.</li>
            <li>Lightweight commenting, attachments, and presence without leaving the heatmap.</li>
            <li>Future integrations for Slack, Notion, Google Calendar, and Figma.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-400">
            Outcome
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Teams reduce time spent chasing status updates and focus on the tasks with
            the highest risk. Early user testing showed faster standups and clearer ownership.
          </p>
        </section>

        <div>
          <button
            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-100 hover:border-emerald-400 hover:text-emerald-200 transition"
            onClick={() => router.push("/")}
          >
            ← Back to canvas
          </button>
        </div>
      </div>
    </main>
  );
}
