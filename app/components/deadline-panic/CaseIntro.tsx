"use client";

import React from "react";

export default function CaseIntro() {
  return (
    <section className="rounded-2xl border border-neutral-900 bg-[#fdfbf7] px-6 py-5">
      <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
        Bakgrund
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1.9fr)_minmax(0,1.2fr)] md:items-start">
        <div className="space-y-3 text-[14px] leading-relaxed text-neutral-800">
          <p>
            Deadline Panic föddes ur känslan av att ha för många parallella
            projekt och för lite överblick. En traditionell portfolio med
            rektangulära casekort kändes för platt i relation till hur arbetet
            faktiskt ser ut: splittrat, överlappande och i ständig rörelse.
          </p>
          <p>
            Lösningen blev en yta i stället för en lista. En digital karta där
            varje projekt är en nod som går att zooma in på, flytta och
            sortera. Det som normalt göms i mappar och Figma-boards lyfts upp
            till en mer fysisk upplevelse.
          </p>
        </div>

        <div className="space-y-3 text-[12px] leading-relaxed text-neutral-700">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Utmaning
            </div>
            <p className="mt-1">
              Hur visar man bredd, process och estetik utan att drunkna i
              scroll? Och hur kan portfolion kännas som ett verktyg – inte
              bara ett skyltfönster?
            </p>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Mål
            </div>
            <ul className="mt-1 list-disc pl-4 space-y-1.5">
              <li>Ge en snabb, visuell karta över allt arbete.</li>
              <li>Göra det intuitivt att zooma in på enskilda case.</li>
              <li>Behålla en ren, typbaserad estetik utan “dribbble-känsla”.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
