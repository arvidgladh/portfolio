"use client";

import React from "react";

export default function CaseSummary() {
  return (
    <section className="rounded-2xl border border-neutral-900 bg-[#fdfbf7] px-6 py-5">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            Resultat & lärdomar
          </div>
          <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.03em]">
            Vad Deadline Panic säger om resten av portfolion
          </h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 text-[13px] leading-relaxed text-neutral-700">
        <div className="space-y-2">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            01 · Överblick
          </h3>
          <p>
            Canvas-tänket gör det enkelt att visa många projekt utan att det
            känns som en katalog. Rekryterare får en snabb bild av spännvidden –
            även om de bara glider runt i några sekunder.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            02 · Personlighet
          </h3>
          <p>
            Layouten är funktionell först, estetisk sedan. Det ger utrymme för
            en egen ton utan att konkurrera med kundcase eller kommande
            projekt, som enkelt kan kopplas på samma system.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            03 · Nästa steg
          </h3>
          <p>
            Framåt kan fler lager läggas till: filter per kategori, en tidslinje
            över projekt, eller flera canvasar för olika roller – utan att
            ändra grundidén.
          </p>
        </div>
      </div>
    </section>
  );
}
