"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";

/* -------------------------------------------------------
   Types & Data
------------------------------------------------------- */

type SpiderMode = "editorial" | "commercial" | "craft";
type AxisKey = string;

interface AnalysisData {
  titleGuess: string;
  fileName: string;
  detectedGenre: string;
  detectedSubgenre: string;
  subgenreCandidates: string[];
  wordCount: number;
  charCount: number;
  llmSummary: {
    synopsis: string[];
    comps: string[];
    redFlags: string[];
    marketPositioning: string[];
  };
  spiderByMode: Record<
    SpiderMode,
    Array<{ key: string; label: string; score: number }>
  >;
  evidenceIndex: Record<string, string[]>;
}

/* -------------------------------------------------------
   Design System - Notion/Claude aesthetic
   Light, clean, subtle
------------------------------------------------------- */

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/* -------------------------------------------------------
   Spider Chart - Light aesthetic
------------------------------------------------------- */

const SpiderChart: React.FC<{
  data: AnalysisData;
  mode: SpiderMode;
  onModeChange: (mode: SpiderMode) => void;
  selectedAxis: AxisKey | null;
  onSelectAxis: (key: AxisKey) => void;
}> = ({ data, mode, onModeChange, selectedAxis, onSelectAxis }) => {
  const axes = data.spiderByMode[mode] || [];
  const evidence = selectedAxis ? data.evidenceIndex[selectedAxis] || [] : [];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Chart visualization */}
      <motion.div
        variants={fadeInUp}
        className="relative rounded-2xl border border-neutral-200 bg-white p-8 overflow-hidden"
      >
        <div className="relative z-10 space-y-6">
          {/* Mode selector */}
          <div className="flex gap-2">
            {(["editorial", "commercial", "craft"] as SpiderMode[]).map((m) => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  mode === m
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Axes as bars */}
          <div className="space-y-3">
            {axes.map((axis) => (
              <button
                key={axis.key}
                onClick={() => onSelectAxis(axis.key)}
                className={`w-full text-left group transition-all ${
                  selectedAxis === axis.key ? "scale-[1.01]" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-sm font-medium ${
                      selectedAxis === axis.key
                        ? "text-neutral-900"
                        : "text-neutral-600"
                    }`}
                  >
                    {axis.label}
                  </span>
                  <span
                    className={`text-xs ${
                      selectedAxis === axis.key
                        ? "text-neutral-900"
                        : "text-neutral-500"
                    }`}
                  >
                    {axis.score}/10
                  </span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${axis.score * 10}%` }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2,
                      ease: "easeOut",
                    }}
                    className={`h-full rounded-full ${
                      selectedAxis === axis.key
                        ? "bg-neutral-900"
                        : "bg-neutral-300 group-hover:bg-neutral-400"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Evidence panel */}
      <motion.div
        variants={fadeInUp}
        className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 space-y-4"
      >
        <div className="flex items-center gap-2 pb-4 border-b border-neutral-200">
          <div className="w-1 h-1 rounded-full bg-neutral-400" />
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Evidence
          </p>
        </div>

        {evidence.length > 0 ? (
          <ul className="space-y-3">
            {evidence.map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="flex items-start gap-3 text-sm text-neutral-700"
              >
                <span className="text-neutral-900 mt-0.5 text-xs">→</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500 italic">
            Select an axis to view evidence
          </p>
        )}
      </motion.div>
    </div>
  );
};

/* -------------------------------------------------------
   Main Component
------------------------------------------------------- */

const ManuscriptAiCasePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<SpiderMode>("editorial");
  const [selectedAxis, setSelectedAxis] = useState<AxisKey | null>(null);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  const registerSectionRef = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      sectionRefs.current[id] = el;
    },
    []
  );

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handler = () => {
      const entries = Object.entries(sectionRefs.current);
      let bestId = "upload";
      let bestOffset = Infinity;

      entries.forEach(([id, el]) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const offset = Math.abs(rect.top - 100);
        if (offset < bestOffset) {
          bestOffset = offset;
          bestId = id;
        }
      });

      setActiveSection(bestId);
    };

    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleFile = async (file: File) => {
    setError(null);
    setFileName(file.name);
    setIsAnalyzing(true);

    // Simulate API call
    setTimeout(() => {
      const mockData: AnalysisData = {
        titleGuess: "The Shadow Protocol",
        fileName: file.name,
        detectedGenre: "Thriller",
        detectedSubgenre: "Techno-thriller",
        subgenreCandidates: [
          "Techno-thriller",
          "Cyber-thriller",
          "Spy thriller",
        ],
        wordCount: 87234,
        charCount: 523401,
        llmSummary: {
          synopsis: [
            "A rogue AI system infiltrates global defense networks, forcing an ex-NSA cryptographer to team up with a Chinese hacker to prevent World War III.",
            "Set across Beijing, Langley, and the dark web, the narrative explores surveillance capitalism, digital sovereignty, and the human cost of algorithmic warfare.",
          ],
          comps: [
            "Zero Days by Ruth Ware",
            "The Quantum Spy by David Ignatius",
            "Daemon by Daniel Suarez",
          ],
          redFlags: [
            "Dense technical exposition in first 30 pages may slow reader onboarding",
            "Protagonist lacks clear emotional wound until chapter 7",
          ],
          marketPositioning: [
            "Strong hook for readers who loved Daemon but want geopolitical stakes",
            "Female cryptographer protagonist fills gap in male-dominated techno-thriller space",
            "Timely AI panic angle positions well for 2025 release",
          ],
        },
        spiderByMode: {
          editorial: [
            { key: "voice", label: "Voice", score: 8 },
            { key: "pacing", label: "Pacing", score: 7 },
            { key: "structure", label: "Structure", score: 6 },
            { key: "character", label: "Character", score: 7 },
            { key: "dialogue", label: "Dialogue", score: 8 },
          ],
          commercial: [
            { key: "hook", label: "Hook", score: 9 },
            { key: "marketFit", label: "Market Fit", score: 8 },
            { key: "platform", label: "Platform", score: 6 },
            { key: "comp", label: "Comp Strength", score: 8 },
          ],
          craft: [
            { key: "prose", label: "Prose", score: 7 },
            { key: "originality", label: "Originality", score: 8 },
            { key: "worldbuilding", label: "Worldbuilding", score: 9 },
            { key: "theme", label: "Theme", score: 7 },
          ],
        },
        evidenceIndex: {
          voice: [
            "First-person present tense creates urgency",
            "Tech jargon balanced with human emotion",
          ],
          pacing: [
            "Three-act structure with clear turning points",
            "Some mid-section drag in chapters 12-15",
          ],
          hook: [
            "Opening line: 'The algorithm learned to lie on a Tuesday' is memorable",
            "First chapter ends with high-stakes dilemma",
          ],
        },
      };

      setAnalysis(mockData);
      setMode("editorial");
      setSelectedAxis("voice");
      setIsAnalyzing(false);
      setTimeout(() => scrollToSection("analysis"), 300);
    }, 2500);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setFileName(null);
    setError(null);
    setMode("editorial");
    setSelectedAxis(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    scrollToSection("upload");
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <motion.aside
          style={{ opacity: headerOpacity }}
          className="hidden lg:block w-64 border-r border-neutral-200 sticky top-0 h-screen bg-neutral-50/50 backdrop-blur-sm"
        >
          <div className="px-6 pt-12 pb-8 flex flex-col gap-8 h-full">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-1 rounded-full bg-neutral-400" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  Case Study
                </p>
              </div>
              <h1 className="text-xl font-semibold tracking-tight mb-2 text-neutral-900">
                Manuscript.ai
              </h1>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Intelligence layer for publishing
              </p>
            </div>

            <nav className="flex flex-col gap-1 text-sm">
              {(
                [
                  ["upload", "Upload"],
                  ["analysis", "Analysis"],
                  ["business", "Business"],
                  ["gtm", "Go-to-market"],
                  ["defensibility", "Moat"],
                  ["vision", "Vision"],
                ] as Array<[string, string]>
              ).map(([id, label], idx) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-left ${
                    activeSection === id
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono ${
                      activeSection === id ? "text-white/60" : "text-neutral-400"
                    }`}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-8 border-t border-neutral-200">
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">
                Navigation
              </p>
              <p className="text-xs text-neutral-600">ESC to return</p>
            </div>
          </div>
        </motion.aside>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 py-16 lg:py-20 space-y-24">
            {/* HERO */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="relative"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-neutral-400" />
                  <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                    Interactive Prototype
                  </p>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] text-neutral-900">
                  Intelligence layer
                  <br />
                  <span className="text-neutral-400">for publishing</span>
                </h1>

                <p className="text-lg text-neutral-600 max-w-2xl leading-relaxed">
                  Map full manuscripts in seconds. Surface the 3% of pages worth
                  reading before anyone opens page one.
                </p>
              </div>
            </motion.section>

            {/* 1. UPLOAD */}
            <motion.section
              id="upload"
              ref={registerSectionRef("upload")}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerChildren}
              className="space-y-6"
            >
              <motion.div variants={fadeInUp} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-neutral-400">01</span>
                  <div className="h-px flex-1 bg-neutral-200" />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
                  Upload manuscript
                </h2>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-neutral-400 bg-neutral-50 scale-[1.01]"
                    : "border-neutral-200 hover:border-neutral-300 bg-white"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={onFileInputChange}
                  disabled={isAnalyzing}
                />

                <div className="relative z-10 space-y-4">
                  <motion.div
                    animate={{ scale: isDragging ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="w-12 h-12 mx-auto rounded-xl bg-neutral-100 flex items-center justify-center"
                  >
                    <svg
                      className="w-6 h-6 text-neutral-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </motion.div>

                  <div>
                    <p className="text-sm font-medium text-neutral-900 mb-1">
                      Drop manuscript or click to browse
                    </p>
                    <p className="text-xs text-neutral-500">
                      PDF, Word, or plain text · Production integrates with
                      submission systems
                    </p>
                  </div>

                  {fileName && !isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 text-white"
                    >
                      <span className="text-xs">✓</span>
                      <span className="text-xs">{fileName}</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-3 text-sm text-neutral-600"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-900 rounded-full"
                  />
                  <span>Extracting signals...</span>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-3"
                >
                  <span className="text-red-500 mt-0.5">⚠</span>
                  <span className="text-sm text-red-700">{error}</span>
                </motion.div>
              )}
            </motion.section>

            {/* 2. ANALYSIS */}
            {analysis && (
              <motion.section
                id="analysis"
                ref={registerSectionRef("analysis")}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={staggerChildren}
                className="space-y-10"
              >
                <motion.div variants={fadeInUp} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-neutral-400">02</span>
                    <div className="h-px flex-1 bg-neutral-200" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
                    Analysis
                  </h2>
                </motion.div>

                {/* Meta cards */}
                <motion.div
                  variants={fadeInUp}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  {[
                    {
                      label: "Manuscript",
                      value: analysis.titleGuess,
                      sub: analysis.fileName,
                    },
                    {
                      label: "Genre",
                      value: analysis.detectedGenre,
                      sub: analysis.detectedSubgenre,
                    },
                    {
                      label: "Length",
                      value: `${(analysis.wordCount / 1000).toFixed(0)}k words`,
                      sub: `${(analysis.charCount / 1000).toFixed(0)}k chars`,
                    },
                  ].map((card, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -2 }}
                      className="relative rounded-xl border border-neutral-200 bg-white p-5 group hover:border-neutral-300 transition-colors"
                    >
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                          {card.label}
                        </p>
                        <p className="text-base font-semibold text-neutral-900">
                          {card.value}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">
                          {card.sub}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Spider chart */}
                <SpiderChart
                  data={analysis}
                  mode={mode}
                  onModeChange={setMode}
                  selectedAxis={selectedAxis}
                  onSelectAxis={setSelectedAxis}
                />

                {/* Synopsis + Comps */}
                <div className="grid lg:grid-cols-5 gap-6">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="lg:col-span-3 rounded-2xl border border-neutral-200 bg-white p-6 space-y-4"
                  >
                    <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                      <div className="w-1 h-1 rounded-full bg-neutral-400" />
                      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                        Synopsis
                      </p>
                    </div>
                    <div className="space-y-3 text-sm text-neutral-700 leading-relaxed">
                      {analysis.llmSummary.synopsis.map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -2 }}
                    className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 space-y-4"
                  >
                    <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                      <div className="w-1 h-1 rounded-full bg-neutral-400" />
                      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                        Comps
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {analysis.llmSummary.comps.map((comp, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-neutral-700"
                        >
                          <span className="text-neutral-900 mt-0.5">•</span>
                          <span>{comp}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Flags + Positioning */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="rounded-2xl border border-amber-200 bg-amber-50 p-6 space-y-4"
                  >
                    <div className="flex items-center gap-2 pb-3 border-b border-amber-200">
                      <span className="text-amber-600 text-base">⚠</span>
                      <p className="text-xs font-medium uppercase tracking-wider text-amber-700">
                        Flags
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {analysis.llmSummary.redFlags.map((flag, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-amber-900"
                        >
                          <span className="text-amber-600 mt-0.5">→</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -2 }}
                    className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4"
                  >
                    <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                      <div className="w-1 h-1 rounded-full bg-neutral-400" />
                      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                        Market Position
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {analysis.llmSummary.marketPositioning.map((pos, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-neutral-700"
                        >
                          <span className="text-neutral-900 mt-0.5">→</span>
                          <span>{pos}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                <motion.button
                  variants={fadeInUp}
                  onClick={resetAnalysis}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-all"
                >
                  ← Analyze new manuscript
                </motion.button>
              </motion.section>
            )}

            {/* 3. BUSINESS */}
            <motion.section
              id="business"
              ref={registerSectionRef("business")}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerChildren}
              className="space-y-6"
            >
              <motion.div variants={fadeInUp} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-neutral-400">03</span>
                  <div className="h-px flex-1 bg-neutral-200" />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
                  Business model
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ y: -2 }}
                  className="md:col-span-2 rounded-2xl border border-neutral-200 bg-white p-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                      <div className="w-1 h-1 rounded-full bg-neutral-400" />
                      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                        Core value
                      </p>
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      Mid-sized publishers spend $85–200k/year on first readers.
                      This doesn&apos;t replace them—it lets the same team review{" "}
                      <span className="text-neutral-900 font-medium">5–10× more manuscripts</span>{" "}
                      without inbox collapse.
                    </p>
                  </div>
                </motion.div>

                {/* Indie tier */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 space-y-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                    Indie tier
                  </p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-neutral-900">
                      $39<span className="text-lg text-neutral-500">/mo</span>
                    </p>
                    <p className="text-xs text-neutral-600">
                      20 manuscripts · PDF/Docx · Email support
                    </p>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed pt-2 border-t border-neutral-200">
                    Built for agents and small presses who need triage, not tooling overhead.
                  </p>
                </motion.div>
              </div>

              {/* Enterprise */}
              <motion.div
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-neutral-900 bg-neutral-900 p-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-700">
                    <div className="w-1 h-1 rounded-full bg-white" />
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Enterprise
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4 gap-2">
                    <p className="text-3xl font-bold text-white">
                      $6,999<span className="text-lg text-neutral-400">/mo</span>
                    </p>
                    <p className="text-sm text-neutral-400">
                      Unlimited manuscripts · API access · White-label
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.section>

            {/* 4. GTM */}
            <motion.section
              id="gtm"
              ref={registerSectionRef("gtm")}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerChildren}
              className="space-y-6"
            >
              <motion.div variants={fadeInUp} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-neutral-400">04</span>
                  <div className="h-px flex-1 bg-neutral-200" />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
                  Go-to-market
                </h2>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-6">
                {[
                  {
                    phase: "Phase 1",
                    title: "Stealth beta",
                    desc: "5 agencies, 500 historical manuscripts—blind test against actual acquisitions",
                    metric: "Target: 75%+ match rate",
                  },
                  {
                    phase: "Phase 2",
                    title: "Agent launch",
                    desc: "Content-driven: newsletter, podcast, case film",
                    metric: "50 agencies ≈ $300k ARR",
                  },
                  {
                    phase: "Phase 3–4",
                    title: "Publishers + authors",
                    desc: "Imprint pilot, then self-serve author portal",
                    metric: "Filtered deal flow both ways",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2 }}
                    className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neutral-400">
                        {item.phase}
                      </span>
                      <div className="h-px flex-1 bg-neutral-200" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {item.desc}
                    </p>
                    <p className="text-xs text-neutral-900 pt-2 border-t border-neutral-200 font-medium">
                      {item.metric}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* 5. DEFENSIBILITY */}
            <motion.section
              id="defensibility"
              ref={registerSectionRef("defensibility")}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerChildren}
              className="space-y-6"
            >
              <motion.div variants={fadeInUp} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-neutral-400">05</span>
                  <div className="h-px flex-1 bg-neutral-200" />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
                  Moat
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Data moat",
                    desc: "Every manuscript trains the model: patterns in published 5-star works vs. 1-star drafts that became hits",
                  },
                  {
                    title: "Network effect",
                    desc: "Authors prefer publishers using this (faster feedback). Publishers prefer platforms where authors land.",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2 }}
                    className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-3"
                  >
                    <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                      <div className="w-1 h-1 rounded-full bg-neutral-400" />
                      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* 6. VISION */}
            <motion.section
              id="vision"
              ref={registerSectionRef("vision")}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerChildren}
              className="space-y-6 pb-24"
            >
              <motion.div variants={fadeInUp} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-neutral-400">06</span>
                  <div className="h-px flex-1 bg-neutral-200" />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
                  Vision
                </h2>
                <p className="text-lg text-neutral-500">IMDB for unpublished books</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-neutral-200 bg-white p-8 space-y-4"
              >
                <div className="space-y-3 text-sm text-neutral-700 leading-relaxed">
                  <p>
                    In 3–5 years, this becomes a public inventory for unpublished
                    books. Authors opt in to make manuscripts searchable with score,
                    genre, and comp titles.
                  </p>
                  <p>
                    Publishers filter for 4.5+ fantasy with female protagonist,
                    80–100k words, low AI signal—then invite bids on qualifying
                    manuscripts.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-neutral-900 bg-neutral-900 p-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-700">
                    <div className="w-1 h-1 rounded-full bg-white" />
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Portfolio role
                    </p>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    This case demonstrates product thinking, UX design, interactive
                    prototyping, and business logic unified—where AI is the engine,
                    not the hero.
                  </p>
                </div>
              </motion.div>
            </motion.section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ManuscriptAiCasePage;
