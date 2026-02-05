"use client";

import React from "react";
import type {
  AnalyzeResponseV1,
  AxisKey,
  EvidenceSnippet,
  SpiderAxisScore,
  SpiderMode,
} from "@/app/api/cases/manuscript-ai/analyze/schema";

type SpiderChartProps = {
  spiderByMode: AnalyzeResponseV1["spiderByMode"];
  evidenceIndex: EvidenceSnippet[];
  mode: SpiderMode;
  onModeChange: (mode: SpiderMode) => void;
  selectedAxisKey: AxisKey | null;
  onSelectAxis: (axis: AxisKey) => void;
};

const MAX_SCORE = 5;
const size = 360;
const center = size / 2;
const radius = 128;
const levels = 4;

const modeOptions: { key: SpiderMode; label: string; description: string }[] = [
  { key: "editorial", label: "Editorial", description: "Line and developmental signals" },
  { key: "genreFit", label: "Genre fit", description: "Promise vs. conventions" },
  { key: "marketNextWeek", label: "Market next week", description: "Commercial readiness" },
];

const genericActions: Record<AxisKey, string[]> = {
  narrativeMomentum: [
    "Tighten chapter endings with micro-cliffhangers.",
    "Reduce redundant beats per scene.",
    "Map key reveals to every 10% of progress.",
  ],
  characterVoice: [
    "Assign distinct lexical sets per POV.",
    "Replace filler dialogue with intent-driven lines.",
    "Add sensory anchors unique to each character.",
  ],
  pacingControl: [
    "Shorten sentences in action sequences.",
    "Alternate scene/sequel cadence to manage breathers.",
    "Trim exposition inside dialogue.",
  ],
  clarity: [
    "Swap passive clauses for active verbs.",
    "Replace abstract nouns with concrete images.",
    "Front-load subject/verb in each sentence.",
  ],
  originality: [
    "Surface a surprising rule-break early.",
    "Invert a familiar trope in chapter one.",
    "Strengthen metaphor clusters unique to the world.",
  ],
  themeCohesion: [
    "Echo the core motif once per chapter.",
    "Align scene goals to the central question.",
    "Cut subplots that do not serve the theme.",
  ],
  genreTropes: [
    "List top genre tropes and cover/subvert them deliberately.",
    "Signal trope subversion early.",
    "Remove off-genre beats in the opening.",
  ],
  readerPromise: [
    "Clarify stakes in the first two pages.",
    "State the central want in narration or thought.",
    "Add a tangible cost for failure.",
  ],
  voiceMatch: [
    "Adjust diction to target age category.",
    "Limit adverb stacking; prefer concrete verbs.",
    "Stabilize narrative distance across chapters.",
  ],
  structureFit: [
    "Check midpoint pivot aligns to genre archetype.",
    "Ensure inciting incident by the 12–15% mark.",
    "Sharpen act breaks with irreversible turns.",
  ],
  povConsistency: [
    "Audit for head-hops and remove them.",
    "Keep interiority to one POV per scene.",
    "Signal POV shifts with clear scene breaks.",
  ],
  ageCategoryFit: [
    "Align content guidance with category norms.",
    "Adjust vocabulary complexity for the target age.",
    "Balance introspection versus action for the audience.",
  ],
  hookStrength: [
    "Condense the premise into a 12-word hook.",
    "Move the unusual element to the first page.",
    "Name the stakes with numbers and specifics.",
  ],
  packagingClarity: [
    "Draft a one-sentence elevator pitch.",
    "Ensure title and subtitle communicate genre.",
    "Align visual cues with chosen comps.",
  ],
  compsFit: [
    "Pick three comps from the last three years.",
    "State 'X meets Y because Z' in query-ready form.",
    "Match tone to the chosen comps.",
  ],
  retention: [
    "End scenes with a forward question.",
    "Shorten paragraph length in tense moments.",
    "Vary sentence rhythm to avoid monotony.",
  ],
  shareability: [
    "Add a quotable line every 8–10 pages.",
    "Use vivid, screenshot-friendly beats.",
    "Include a socially resonant motif.",
  ],
  speedToShelf: [
    "Minimize dependency on niche research.",
    "Simplify settings that require heavy effects to visualize.",
    "Remove complex timeline jumps unless essential.",
  ],
};

function buildRadarPoints(entries: SpiderAxisScore[]) {
  const n = entries.length;
  return entries.map((entry, idx) => {
    const angle = (2 * Math.PI * idx) / n - Math.PI / 2;
    const norm = Math.max(0, Math.min(entry.score / MAX_SCORE, 1));
    const r = radius * norm;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, key: entry.key };
  });
}

function axisGeometry(entries: SpiderAxisScore[]) {
  const n = entries.length;
  return entries.map((entry, idx) => {
    const angle = (2 * Math.PI * idx) / n - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const labelRadius = radius + 32;
    const lx = center + labelRadius * Math.cos(angle);
    const ly = center + labelRadius * Math.sin(angle);
    return { key: entry.key, label: entry.label, x, y, lx, ly };
  });
}

const SpiderChart: React.FC<SpiderChartProps> = ({
  spiderByMode,
  evidenceIndex,
  mode,
  onModeChange,
  selectedAxisKey,
  onSelectAxis,
}) => {
  const entries = spiderByMode[mode] || [];
  const points = buildRadarPoints(entries);
  const axes = axisGeometry(entries);
  const polygonPointsAttr = points.map((p) => `${p.x},${p.y}`).join(" ");

  const levelPolygons = Array.from({ length: levels }, (_, levelIdx) => {
    const scale = ((levelIdx + 1) / levels) * radius;
    const pts = entries.map((_, idx) => {
      const angle = (2 * Math.PI * idx) / entries.length - Math.PI / 2;
      const x = center + scale * Math.cos(angle);
      const y = center + scale * Math.sin(angle);
      return `${x},${y}`;
    });
    return pts.join(" ");
  });

  const selectedEvidence = selectedAxisKey
    ? evidenceIndex.filter((e) => e.axisKey === selectedAxisKey).slice(0, 6)
    : [];

  const actions = selectedAxisKey
    ? genericActions[selectedAxisKey] || ["No actions provided. Add evidence to unlock targeted actions."]
    : [];

  return (
    <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Spider analysis</p>
          <p className="text-sm text-neutral-300">
            Click an axis to inspect evidence and next actions. Toggle modes for different lenses.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 rounded-full p-1">
          {modeOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => onModeChange(opt.key)}
              className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                mode === opt.key ? "bg-white text-black" : "text-neutral-300 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(320px,420px)] gap-6">
        <div className="flex items-center justify-center">
          <svg width={size} height={size} className="max-w-full h-auto">
            <defs>
              <pattern id="gridDots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.7" fill="#262626" />
              </pattern>
            </defs>
            <rect x="0" y="0" width={size} height={size} fill="url(#gridDots)" rx={16} />

            {levelPolygons.map((pointsAttr, idx) => (
              <polygon
                key={idx}
                points={pointsAttr}
                fill="none"
                stroke="#3f3f46"
                strokeWidth={1}
                opacity={0.4 - idx * 0.05}
              />
            ))}

            {axes.map((axis) => {
              const isActive = selectedAxisKey === axis.key;
              return (
                <line
                  key={axis.key}
                  x1={center}
                  y1={center}
                  x2={axis.x}
                  y2={axis.y}
                  stroke={isActive ? "#ffffff" : "#52525b"}
                  strokeWidth={isActive ? 2 : 1}
                  opacity={isActive ? 0.95 : 0.7}
                />
              );
            })}

            <polygon points={polygonPointsAttr} fill="rgba(79, 70, 229, 0.18)" stroke="#a78bfa" strokeWidth={2} />

            {points.map((p) => {
              const isActive = selectedAxisKey === p.key;
              return (
                <circle
                  key={p.key}
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 6 : 4}
                  fill={isActive ? "#c4b5fd" : "#a78bfa"}
                  stroke={isActive ? "#f5f3ff" : "none"}
                  strokeWidth={isActive ? 1.4 : 0}
                  onClick={() => onSelectAxis(p.key as AxisKey)}
                  className="cursor-pointer"
                />
              );
            })}

            {axes.map((axis) => {
              const isActive = selectedAxisKey === axis.key;
              return (
                <text
                  key={axis.key}
                  x={axis.lx}
                  y={axis.ly}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="select-none cursor-pointer"
                  style={{
                    fontSize: 10,
                    fill: isActive ? "#e5e5e5" : "#9ca3af",
                  }}
                  onClick={() => onSelectAxis(axis.key as AxisKey)}
                >
                  {axis.label}
                </text>
              );
            })}
          </svg>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Evidence & actions</p>
              <p className="text-sm text-neutral-200">
                {selectedAxisKey ? "Axis focus" : "Select an axis to inspect evidence"}
              </p>
            </div>
            {selectedAxisKey && (
              <div className="text-right text-xs text-neutral-400">
                <p className="font-medium">
                  Score: {entries.find((e) => e.key === selectedAxisKey)?.score.toFixed(1) ?? "–"}/5
                </p>
                <p>
                  Confidence:{" "}
                  {(entries.find((e) => e.key === selectedAxisKey)?.confidence ?? 0).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Evidence snippets</p>
            {selectedAxisKey && selectedEvidence.length === 0 && (
              <p className="text-xs text-neutral-500">
                No evidence returned for this axis. Add more pages or rerun analysis.
              </p>
            )}
            <div className="space-y-2">
              {selectedEvidence.map((snippet) => (
                <div key={snippet.id} className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3">
                  <p className="text-xs text-neutral-400 mb-1">{snippet.note || "Signal"}</p>
                  <p className="text-sm text-neutral-100 line-clamp-4 leading-snug">{snippet.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Actions</p>
            {selectedAxisKey ? (
              <ul className="space-y-2 text-sm text-neutral-200">
                {actions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-xs text-indigo-300 mt-[3px]">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-neutral-500">Pick an axis to unlock targeted actions.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiderChart;
