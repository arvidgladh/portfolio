"use client";

import React from "react";

const PHASES = [
  {
    label: "01 · Kartan som koncept",
    heading: "Från listor till koordinater",
    body: "Första steget var att översätta portfolion till en karta: vilka typer av projekt finns, hur relaterar de till varandra och vad betyder avstånd visuellt? Resultatet blev ett enkelt koordinatsystem där varje case får en definierad position.",
  },
  {
    label: "02 · Interaktion",
    heading: "Zoom, drag och känslan av kontroll",
    body: "Canvasen skulle kännas taktil utan att bli spel. Drag på ytan panorerar, drag på kort flyttar noden. Dubbelklick zoomar in och öppnar caset – en enkel gest som ger blicken en tydlig destination.",
  },
  {
    label: "03 · Estetik",
    heading: "Brutalism möter verktyg",
    body: "Inga glassiga gradients, inga glas-effekter. I stället: svarta ramar, mjuka skuggor och en dämpad bakgrundston. Typografin bär det mesta av uttrycket, med små färgaccenter kopplade till respektive projekt.",
  },
  {
    label: "04 · Systemtänk",
    heading: "En karta som kan växa",
    body: "Strukturen är byggd för att klara fler projekt, fler lager och fler vyer. Fler canvasar kan läggas till (t.ex. en budget-karta eller en tidslinje-karta) utan att bryta formeln.",
  },
];

export default function CaseDeepDive() {
  return (
    <section className="space-y-4 rounded-2xl border border-neutral-900 bg-[#fdfbf7] px-6 py-5">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            Process
          </div>
          <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.03em]">
            Hur Deadline Panic tog form
          </h2>
        </div>
        <p className="hidden max-w-xs text-[12px] leading-relaxed text-neutral-700 md:block">
          Från första skiss till fungerande prototyp. Fokus låg på att hålla
          upplevelsen ren, men ge tillräckligt mycket taktilitet för att kännas
          fysisk.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {PHASES.map((phase) => (
          <article
            key={phase.label}
            className="flex flex-col justify-between border border-neutral-300 bg-[#f9f6f0] px-4 py-3 text-[13px] leading-relaxed"
          >
            <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              {phase.label}
            </div>
            <h3 className="mt-1 text-[14px] font-semibold tracking-tight text-neutral-900">
              {phase.heading}
            </h3>
            <p className="mt-1 text-neutral-700">{phase.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
