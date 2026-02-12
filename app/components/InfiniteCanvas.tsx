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
  { id: "01", title: "panic.ai", meta: "Live prototype", slug: "/cases/deadline-panic" },
  { id: "02", title: "paus", meta: "Cash-flow forecast", slug: "/cases/paus-budgetvag" },
  { id: "03", title: "origami", meta: "AI scanner concept", slug: "/cases/origami" },
  { id: "04", title: "Bokbörsen", meta: "Marketplace redesign", slug: "/cases/bokborsen" },
  { id: "05", title: "manuscript.ai", meta: "Manuscript scoring engine", slug: "/cases/manuscript-ai" },
];

type AiThumb = {
  id: string;
  title: string;
  src: string;
  alt: string;
  href: string;
};

const AI_THUMBS: AiThumb[] = [
  {
    id: "AI01",
    title: "Olive Skewer",
    src: "/portfolio/ai/ai__food__olive_skewer__studio__minimal__v01.jpg",
    alt: "Studio photograph of three green olives on cocktail skewer",
    href: "/cases/manuscript-ai",
  },
  {
    id: "AI02",
    title: "Cart Horizon",
    src: "/portfolio/ai/ai__landscape__golf_cart__cinematic__minimal__v01.jpg",
    alt: "Golf cart on minimal horizon landscape",
    href: "/cases/manuscript-ai",
  },
  {
    id: "AI03",
    title: "Solitary Cumulus",
    src: "/portfolio/ai/ai__landscape__solitary_cumulus_cloud__minimal__surreal__v01.jpg",
    alt: "Single cumulus cloud above field",
    href: "/cases/manuscript-ai",
  },
  {
    id: "AI04",
    title: "Glass Reflection Figure",
    src: "/portfolio/ai/ai__lifestyle__glass_reflection_figure__architectural__california__v01.jpg",
    alt: "Person behind reflective glass door",
    href: "/cases/manuscript-ai",
  },
  {
    id: "AI05",
    title: "Hose Spray Portrait",
    src: "/portfolio/ai/ai__lifestyle__hose_spray_portrait__flash__editorial__v01.jpg",
    alt: "Person spraying water hose at face",
    href: "/cases/manuscript-ai",
  },
  {
    id: "AI06",
    title: "Fragile Dream Package",
    src: "/portfolio/ai/ai__product__fragile_dream_package__conceptual__studio__v01.jpg",
    alt: "Plastic bag containing cloud with fragile label",
    href: "/cases/manuscript-ai",
  },
];

export default function InfiniteCanvas() {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);
  const [activeAi, setActiveAi] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [copied, setCopied] = useState<"email" | "phone" | null>(null);

  function copy(text: string, which: "email" | "phone") {
    navigator.clipboard.writeText(text);
    setCopied(which);
    window.setTimeout(() => setCopied(null), 1200);
  }

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

              {/* Right block + Contact */}
              <div className="sm:text-right relative">
                <p className="text-sm mb-1">Product &amp; Campaign</p>
                <p className="text-sm text-black/40">2024–2025</p>

                <div className="mt-4 sm:mt-3 flex sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setContactOpen((v) => !v)}
                    className="text-[11px] sm:text-xs uppercase tracking-[0.2em] border border-black px-3 py-2 hover:bg-black hover:text-white transition"
                  >
                    Contact
                  </button>
                </div>

                {contactOpen && (
                  <div className="mt-3 sm:mt-3 sm:absolute sm:right-0 sm:top-[78px] w-full sm:w-[360px] border border-black bg-white text-black p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                          Email
                        </p>
                        <p className="text-sm font-mono break-all">
                          arvid.gladh@hotmail.com
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => copy("arvid.gladh@hotmail.com", "email")}
                        className="text-[11px] uppercase tracking-[0.2em] border border-black px-3 py-2 hover:bg-black hover:text-white transition whitespace-nowrap"
                      >
                        {copied === "email" ? "Copied" : "Copy"}
                      </button>
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                          Phone
                        </p>
                        <p className="text-sm font-mono break-all">
                          +467 613 393 96
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => copy("+467 613 393 96", "phone")}
                        className="text-[11px] uppercase tracking-[0.2em] border border-black px-3 py-2 hover:bg-black hover:text-white transition whitespace-nowrap"
                      >
                        {copied === "phone" ? "Copied" : "Copy"}
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <a
                        href="mailto:arvid.gladh@hotmail.com"
                        className="text-[11px] uppercase tracking-[0.2em] text-black/60 hover:text-black transition"
                      >
                        Mail →
                      </a>
                      <a
                        href="tel:+46761339396"
                        className="text-[11px] uppercase tracking-[0.2em] text-black/60 hover:text-black transition"
                      >
                        Call →
                      </a>
                      <button
                        type="button"
                        onClick={() => setContactOpen(false)}
                        className="text-[11px] uppercase tracking-[0.2em] text-black/60 hover:text-black transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
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

            {/* AI Visuals */}
            <section className="mt-10 sm:mt-14">
              <div className="flex items-end justify-between gap-6 border-t border-black pt-7 sm:pt-10">
                <div>
                  <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-black/40">
                    AI Visuals
                  </p>
                  <h3 className="mt-2 text-[22px] sm:text-[28px] leading-[1] tracking-[-0.03em] font-semibold">
                    Image artifacts
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/cases/manuscript-ai")}
                  className="text-[11px] sm:text-xs uppercase tracking-[0.2em] border border-black px-3 py-2 hover:bg-black hover:text-white transition"
                >
                  Open collection →
                </button>
              </div>

              <div className="mt-5 sm:mt-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {AI_THUMBS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => router.push(t.href)}
                    onMouseEnter={() => setActiveAi(t.id)}
                    onMouseLeave={() => setActiveAi(null)}
                    className={`
                      group relative border border-black bg-white overflow-hidden
                      aspect-[3/4] sm:aspect-[2/3]
                      transition
                      ${activeAi === t.id ? "bg-black" : "hover:bg-black/5"}
                    `}
                    aria-label={`Open AI artifact collection from: ${t.title}`}
                  >
                    <img
                      src={t.src}
                      alt={t.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* subtle label */}
                    <div
                      className={`
                        absolute inset-x-0 bottom-0 p-2
                        bg-gradient-to-t from-black/70 to-black/0
                        opacity-100
                      `}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/80">
                          {t.id}
                        </span>
                        <span className="text-[10px] text-white/80">
                          →
                        </span>
                      </div>

                      <div className="mt-1 text-[11px] leading-[1.1] text-white">
                        {t.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <p className="mt-4 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-black/40">
                Click an image to open
              </p>
            </section>
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