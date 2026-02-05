"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CaseCard = {
  id: string;
  title: string;
  meta: string;
  slug: string;
};

const CASES: CaseCard[] = [
  {
    id: "01",
    title: "panic.ai",
    meta: "Live prototype",
    slug: "/cases/deadline-panic",
  },
  {
    id: "02",
    title: "paus",
    meta: "Cash-flow forecast",
    slug: "/cases/paus-budgetvag",
  },
  {
    id: "03",
    title: "origami",
    meta: "AI scanner concept",
    slug: "/cases/origami",
  },
  {
    id: "04",
    title: "Bokbörsen",
    meta: "Marketplace redesign",
    slug: "/cases/bokborsen",
  },
  {
    id: "05",
    title: "manuscript.ai",
    meta: "Manuscript scoring engine",
    slug: "/cases/manuscript-ai",
  },
];

export default function InfiniteCanvas() {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-black px-5 sm:px-6 py-8 sm:py-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 sm:gap-0 mb-10 sm:mb-12">
              <div>
                <h1 className="text-[44px] leading-[0.92] tracking-[-0.05em] font-bold mb-3 sm:text-[72px] sm:leading-[0.9] sm:tracking-[-0.04em]">
                  Selected
                  <br />
                  Work
                </h1>
                <p className="text-[11px] sm:text-sm uppercase tracking-[0.2em] text-black/40">
                  Arvid Gladh — Stockholm
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-sm mb-1">Product &amp; Campaign</p>
                <p className="text-sm text-black/40">2024–2025</p>
              </div>
            </div>
          </div>
        </header>

        {/* Cases */}
        <div className="flex-1 px-5 sm:px-6 py-8 sm:py-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="space-y-0">
              {CASES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(item.slug)}
                  onMouseEnter={() => setActive(item.id)}
                  onMouseLeave={() => setActive(null)}
                  className={`
                    w-full text-left border-b border-black
                    transition-all duration-300 ease-out
                    ${
                      active === item.id
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }
                  `}
                >
                  {/* Desktop: row layout. Mobile: stack layout */}
                  <div className="py-7 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-8">
                    {/* Left */}
                    <div className="flex items-baseline gap-4 sm:gap-8">
                      <span
                        className={`
                          text-[11px] sm:text-sm font-mono tracking-[0.2em]
                          transition-opacity duration-300
                          ${active === item.id ? "opacity-40" : "opacity-30"}
                        `}
                      >
                        {item.id}
                      </span>

                      <h2 className="text-[34px] leading-[0.98] tracking-[-0.04em] font-semibold sm:text-[56px] sm:leading-[0.95] sm:tracking-[-0.03em]">
                        {item.title}
                      </h2>
                    </div>

                    {/* Right */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-12">
                      <span className="text-[11px] sm:text-sm tracking-[0.12em] uppercase whitespace-nowrap text-black/60 sm:text-inherit">
                        {item.meta}
                      </span>

                      <span
                        className={`
                          text-xl sm:text-2xl transition-transform duration-300
                          ${active === item.id ? "translate-x-2" : ""}
                        `}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Mobile hint row */}
            <div className="pt-6 sm:hidden">
              <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                Tap a row to open
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-black px-5 sm:px-6 py-5 sm:py-6">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between text-[11px] sm:text-xs uppercase tracking-[0.2em]">
            <span>Interactive prototypes</span>
            <span className="text-black/40 hidden sm:inline">ESC to return</span>
            <span className="text-black/40 sm:hidden">Tap to open</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
