"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Section =
  | "boot"
  | "menu"
  | "brief"
  | "problem"
  | "insights"
  | "solution"
  | "live";

type Tone = "corporate" | "playful" | "bold" | "minimal" | "";

type Version = {
  id: number;
  text: string;
  timestamp: string;
};

type CaseItem = {
  id: number;
  title: string;
  selected: boolean;
  content: string;
};

type AccordionSection = "editor" | "engine" | "history" | "mirror" | "export" | "editing";

export default function TheVaultCase() {
  const [section, setSection] = useState<Section>("boot");
  const [time, setTime] = useState<string | null>(null);
  const [tone, setTone] = useState<Tone>("");
  const [customTone, setCustomTone] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientLogo, setClientLogo] = useState("");
  const [mirrorLink, setMirrorLink] = useState("");
  const [sampleCaseText, setSampleCaseText] = useState(
    "original case: we helped a startup redesign their app, improving user engagement by 40%."
  );
  const [editingText, setEditingText] = useState(sampleCaseText);
  const [versions, setVersions] = useState<Version[]>([
    {
      id: 1,
      text: "initial draft: basic redesign project with good results.",
      timestamp: "2025-12-06 14:00",
    },
  ]);
  const [currentVersion, setCurrentVersion] = useState(1);
  const [exportFormat, setExportFormat] = useState<"pdf" | "figma" | "keynote" | "">("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [cases, setCases] = useState<CaseItem[]>([
    { id: 1, title: "app redesign for startup", selected: false, content: "redesigned mobile app interface." },
    { id: 2, title: "branding overhaul for agency", selected: false, content: "complete brand refresh." },
    { id: 3, title: "ux audit for e-commerce", selected: false, content: "user experience analysis and improvements." },
    { id: 4, title: "motion graphics campaign", selected: false, content: "animated video series." },
  ]);
  const [openAccordions, setOpenAccordions] = useState<Record<AccordionSection, boolean>>({
    editor: true,
    engine: false,
    history: false,
    mirror: false,
    export: false,
    editing: false,
  });
  const [subCommand, setSubCommand] = useState("");
  const [liveOutput, setLiveOutput] = useState<string[]>([]);

  // boot → menu
  useEffect(() => {
    const timer = setTimeout(() => setSection("menu"), 3200);
    return () => clearTimeout(timer);
  }, []);

  // live clock – client only
  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  const run = (cmd: string) => {
    const c = cmd.toLowerCase().trim();

    if (
      [
        "brief",
        "problem",
        "insights",
        "solution",
        "vault",
        "live",
        "open vault",
        "clear",
        "cls",
        "help",
      ].includes(c)
    ) {
      if (c === "vault" || c === "live" || c === "open vault") {
        setSection("live");
      } else if (c === "clear" || c === "cls" || c === "help") {
        setSection("menu");
      } else {
        setSection(c as Section);
      }
    }
  };

  const runSubCommand = (cmd: string) => {
    const c = cmd.toLowerCase().trim();
    setLiveOutput([...liveOutput, `> ${c}`]);
    setSubCommand("");

    switch (c) {
      case "help":
        setLiveOutput((prev) => [...prev, "commands: list cases, select [id], deselect [id], export [format], rollback [id], reset"]);
        break;
      case "list cases":
        const caseList = cases.map((c) => `${c.id}: ${c.title} ${c.selected ? "(selected)" : ""}`).join("\n");
        setLiveOutput((prev) => [...prev, caseList || "no cases"]);
        break;
      case "reset":
        resetDemo();
        setLiveOutput((prev) => [...prev, "demo reset."]);
        break;
      default:
        if (c.startsWith("select ")) {
          const id = parseInt(c.split(" ")[1]);
          toggleCaseSelection(id);
          setLiveOutput((prev) => [...prev, `case ${id} selected.`]);
        } else if (c.startsWith("deselect ")) {
          const id = parseInt(c.split(" ")[1]);
          toggleCaseSelection(id);
          setLiveOutput((prev) => [...prev, `case ${id} deselected.`]);
        } else if (c.startsWith("export ")) {
          const fmt = c.split(" ")[1] as "pdf" | "figma" | "keynote";
          setExportFormat(fmt);
          exportDeck();
        } else if (c.startsWith("rollback ")) {
          const id = parseInt(c.split(" ")[1]);
          rollbackVersion(id);
        } else {
          setLiveOutput((prev) => [...prev, "unknown command. type 'help'."]);
        }
    }
  };

  const applyTone = () => {
    let newText = "";
    const appliedTone = customTone || tone;
    switch (appliedTone.toLowerCase()) {
      case "corporate":
        newText = "we delivered enterprise-grade solutions, focusing on scalability and roi metrics.";
        break;
      case "playful":
        newText = "we sprinkled some creative flair on their app, boosting engagement by a solid 40%.";
        break;
      case "bold":
        newText = "we tackled the redesign head-on, driving engagement up 40% without compromise.";
        break;
      case "minimal":
        newText = "app redesign. +40% engagement.";
        break;
      default:
        newText = `custom tone '${appliedTone}': adapted the redesign narrative accordingly, with 40% engagement lift.`;
    }

    saveNewVersion(newText);
    setTone("");
    setCustomTone("");
    showFeedback("tone applied.");
  };

  const saveEdit = () => {
    if (editingText.trim() && editingText !== sampleCaseText) {
      saveNewVersion(editingText);
      showFeedback("edit saved.");
    } else {
      showFeedback("no changes.");
    }
  };

  const saveNewVersion = (newText: string) => {
    const newVersion: Version = {
      id: versions.length + 1,
      text: newText,
      timestamp: new Date().toLocaleString(),
    };

    setVersions([...versions, newVersion]);
    setCurrentVersion(newVersion.id);
    setSampleCaseText(newText);
    setEditingText(newText);
  };

  const rollbackVersion = (versionId: number) => {
    const selected = versions.find((v) => v.id === versionId);
    if (selected) {
      setSampleCaseText(selected.text);
      setEditingText(selected.text);
      setCurrentVersion(versionId);
      showFeedback("rolled back.");
    }
  };

  const toggleCaseSelection = (caseId: number) => {
    setCases(cases.map((c) => c.id === caseId ? { ...c, selected: !c.selected } : c));
  };

  const generateMirror = () => {
    if (clientName.trim()) {
      const selectedCases = cases.filter((c) => c.selected).map((c) => c.title).join("-");
      const logoParam = clientLogo ? `&logo=${encodeURIComponent(clientLogo)}` : "";
      setMirrorLink(`https://thevault.app/mirror/${encodeURIComponent(clientName.toLowerCase())}?cases=${encodeURIComponent(selectedCases)}${logoParam}`);
      showFeedback("mirror generated.");
    } else {
      showFeedback("client name required.");
    }
  };

  const exportDeck = () => {
    if (exportFormat && cases.some((c) => c.selected)) {
      alert(`exporting selected cases to ${exportFormat}... (mock: file with ${cases.filter((c) => c.selected).length} cases)`);
      setExportFormat("");
      showFeedback("deck exported.");
    } else {
      showFeedback("select cases/format.");
    }
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(""), 3000);
  };

  const toggleAccordion = (accSection: AccordionSection) => {
    setOpenAccordions((prev) => ({ ...prev, [accSection]: !prev[accSection] }));
  };

  const resetDemo = () => {
    setTone("");
    setCustomTone("");
    setClientName("");
    setClientLogo("");
    setMirrorLink("");
    setSampleCaseText("original case: we helped a startup redesign their app, improving user engagement by 40%.");
    setEditingText("original case: we helped a startup redesign their app, improving user engagement by 40%.");
    setVersions([
      {
        id: 1,
        text: "initial draft: basic redesign project with good results.",
        timestamp: "2025-12-06 14:00",
      },
    ]);
    setCurrentVersion(1);
    setExportFormat("");
    setCases(cases.map((c) => ({ ...c, selected: false })));
    setLiveOutput([]);
    setOpenAccordions({
      editor: true,
      engine: false,
      history: false,
      mirror: false,
      export: false,
      editing: false,
    });
  };

  return (
    <div className="h-screen bg-black text-green-400 font-mono overflow-hidden flex flex-col relative">
      {/* crt effect */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-green-900/5 to-transparent" />
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.04) 2px, rgba(0,255,0,0.04) 4px)",
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {/* boot */}
        {section === "boot" && (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center p-10"
          >
            <pre className="text-sm leading-relaxed">
{`> booting the vault os v2.0
> decrypting core modules............ ok
> loading case engine.................. ok
> initializing ai narrative layer...... ok
> mounting client mirror............... ok
> root access granted.................. ok

████████████████████████████████████
█   the vault  │  live system      █
████████████████████████████████████

type "help" for commands

ready.`}
            </pre>
          </motion.div>
        )}

        {/* menu */}
        {section === "menu" && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col justify-between p-12"
          >
            <div>
              <h1 className="text-5xl font-bold mb-12 tracking-tighter lowercase">
                the vault
              </h1>
              <p className="text-lg opacity-70 mb-10">available commands:</p>
              <div className="space-y-4 text-2xl text-green-300">
                <button
                  onClick={() => setSection("brief")}
                  className="block text-left hover:text-white transition"
                >
                  brief → project brief
                </button>
                <button
                  onClick={() => setSection("problem")}
                  className="block text-left hover:text-white transition"
                >
                  problem → the pain
                </button>
                <button
                  onClick={() => setSection("insights")}
                  className="block text-left hover:text-white transition"
                >
                  insights → what i learned
                </button>
                <button
                  onClick={() => setSection("solution")}
                  className="block text-left hover:text-white transition"
                >
                  solution → how i fixed it
                </button>
                <button
                  onClick={() => setSection("live")}
                  className="block text-left hover:text-white transition"
                >
                  vault → enter live system
                </button>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const input = form.elements.namedItem("cmd") as HTMLInputElement;
                run(input.value);
                input.value = "";
              }}
            >
              <div className="flex items-center">
                <span className="text-3xl">→</span>
                <input
                  name="cmd"
                  autoFocus
                  placeholder='type command... (e.g. "brief", "problem", "vault")'
                  className="bg-transparent outline-none ml-6 text-3xl w-full font-light placeholder:text-green-700"
                />
              </div>
            </form>
          </motion.div>
        )}

        {/* content sections */}
        {(section === "brief" ||
          section === "problem" ||
          section === "insights" ||
          section === "solution") && (
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col justify-between p-8 md:p-12"
          >
            <div className="overflow-y-auto">
              <h2 className="text-5xl md:text-6xl font-bold text-green-300 mb-12 lowercase">
                {section === "brief" && "project brief"}
                {section === "problem" && "the pain"}
                {section === "insights" && "what i learned"}
                {section === "solution" && "how i fixed it"}
              </h2>

              {/* brief */}
              {section === "brief" && (
                <div className="text-lg md:text-xl leading-relaxed max-w-4xl space-y-6">
                  <p>
                    <span className="text-green-300">product name:</span>{" "}
                    the vault.
                  </p>
                  <p>
                    <span className="text-green-300">what is it?</span> a
                    standalone saas product replacing notion, figma decks,
                    pdfs, and google drive folders for pitching creative work.
                  </p>
                  <p>
                    <span className="text-green-300">short pitch:</span>{" "}
                    “the vault is notion + figma + chatgpt + airtable – built solely to sell creative work.”
                  </p>
                  <div>
                    <p className="text-green-300 mb-2">for who?</p>
                    <ul className="list-disc list-inside space-y-1 text-base md:text-lg">
                      <li>freelancers – designers, copywriters, strategists, motion designers</li>
                      <li>small/medium agencies (5–40 people) in branding, ux, advertising, product</li>
                      <li>
                        individual creators ditching pdfs for live experiences
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* problem */}
              {section === "problem" && (
                <div className="text-lg md:text-xl leading-relaxed max-w-5xl space-y-8">
                  <p className="text-green-300">
                    four major pains the vault kills:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 text-base md:text-lg">
                    <div className="border border-green-800/60 rounded-xl p-4 bg-black/40">
                      <p className="font-semibold text-green-300 mb-2">
                        1. every pitch = 4–12 hours rework
                      </p>
                      <p className="text-green-100/80">
                        today: cut, paste, rebuild decks per client.
                        <br />
                        <span className="text-green-300">
                          the vault:
                        </span>{" "}
                        all cases ready inside. pick 3–8 → ai builds pitchdeck in seconds.
                      </p>
                    </div>

                    <div className="border border-green-800/60 rounded-xl p-4 bg-black/40">
                      <p className="font-semibold text-green-300 mb-2">
                        2. clients get old versions
                      </p>
                      <p className="text-green-100/80">
                        today: stale pdfs and figma links linger in emails.
                        <br />
                        <span className="text-green-300">
                          the vault:
                        </span>{" "}
                        client gets private link – always updated, always live.
                      </p>
                    </div>

                    <div className="border border-green-800/60 rounded-xl p-4 bg-black/40">
                      <p className="font-semibold text-green-300 mb-2">
                        3. clients don't grasp value
                      </p>
                      <p className="text-green-100/80">
                        today: clients scroll static slides.
                        <br />
                        <span className="text-green-300">
                          the vault:
                        </span>{" "}
                        clients change tone-of-voice, shift focus, see case adapt. value gets tactile.
                      </p>
                    </div>

                    <div className="border border-green-800/60 rounded-xl p-4 bg-black/40">
                      <p className="font-semibold text-green-300 mb-2">
                        4. drowning in versions & feedback
                      </p>
                      <p className="text-green-100/80">
                        today: “final_v7_last_keynote_final2”.
                        <br />
                        <span className="text-green-300">
                          the vault:
                        </span>{" "}
                        full version history, one-button rollback, client-specific mirrors stay clean.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* insights */}
              {section === "insights" && (
                <div className="text-lg md:text-xl leading-relaxed max-w-4xl space-y-6">
                  <p>
                    portfolios today are built to show work – not close deals. they're static, generic, designed for viewing, not collaboration.
                  </p>
                  <p>
                    the vault starts from one simple insight:
                    <br />
                    <span className="text-green-300">
                      “first time someone builds a tool 100% optimized to sell creative work – not document it.”
                    </span>
                  </p>
                  <p>
                    it's not a portfolio. it's a sales weapon. cases aren't archive material anymore – they're live models where clients test, twist, scale, see exactly what they buy.
                  </p>
                  <p>
                    when you edit case live in meetings, switch tone, add results, save client-specific version in seconds – you stop presenting and start
                    <span className="text-green-300"> co-building</span> with the client.
                  </p>
                </div>
              )}

              {/* solution */}
              {section === "solution" && (
                <div className="text-lg md:text-xl leading-relaxed max-w-5xl space-y-10">
                  <div>
                    <p className="text-green-300 mb-4">
                      core features – q1 2025:
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 text-base md:text-lg">
                      <div className="border border-green-800/60 rounded-xl p-4 bg-black/40">
                        <p className="font-semibold text-green-300 mb-1">
                          drag & drop case editor
                        </p>
                        <p className="text-green-100/80">
                          add images, text, results – case auto-structures. build stories, not files.
                        </p>
                      </div>
                      <div className="border border-green-800/60 rounded-xl p-4 bg-black/40">
                        <p className="font-semibold text-green-300 mb-1">
                          ai narrative engine
                        </p>
                        <p className="text-green-100/80">
                          type “make it more corporate” or “more playful” →
                          rewrites whole case in seconds.
                        </p>
                      </div>
                      <div className="border border-green-800/60 rounded-xl p-4 bg-black/40">
                        <p className="font-semibold text-green-300 mb-1">
                          one-click pitchdeck export
                        </p>
                        <p className="text-green-100/80">
                          pick cases to include → get pdf, figma, or keynote direct.
                        </p>
                      </div>
                      <div className="border border-green-800/60 rounded-xl p-4 bg-black/40">
                        <p className="font-semibold text-green-300 mb-1">
                          client mirror links
                        </p>
                        <p className="text-green-100/80">
                          create link where client sees only their selected cases +
                          their logo. always updated.
                        </p>
                      </div>
                      <div className="border border-green-800/60 rounded-xl p-4 bg-black/40">
                        <p className="font-semibold text-green-300 mb-1">
                          live editing in client meetings
                        </p>
                        <p className="text-green-100/80">
                          you and client edit case together – realtime, right in the meeting.
                        </p>
                      </div>
                      <div className="border border-green-800/60 rounded-xl p-4 bg-black/40">
                        <p className="font-semibold text-green-300 mb-1">
                          version history, rollback & tone switcher
                        </p>
                        <p className="text-green-100/80">
                          full history, quick rollback, ready tone modes:
                          formal ↔ bold ↔ playful ↔ minimal.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-green-300 mb-3">planned pricing:</p>
                    <ul className="space-y-2 text-base md:text-lg">
                      <li>
                        <span className="font-semibold text-green-300">
                          solo:
                        </span>{" "}
                        $39/mo
                      </li>
                      <li>
                        <span className="font-semibold text-green-300">
                          studio:
                        </span>{" "}
                        $149/mo (up to 10 users)
                      </li>
                      <li>
                        <span className="font-semibold text-green-300">
                          agency:
                        </span>{" "}
                        $399+/mo (unlimited + whitelabel)
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSection("menu")}
              className="text-3xl text-green-400 hover:text-white self-start mt-8 md:mt-20"
            >
              ← back
            </button>
          </motion.div>
        )}

        {/* live access – accordion for sections to avoid scroll issues */}
        {section === "live" && (
          <motion.div
            key="live"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto space-y-6"
          >
            <div>
              <h1 className="text-5xl font-black leading-tight mb-6 lowercase">
                access granted
              </h1>
              <p className="text-2xl text-green-300 mb-8">
                the vault is not a portfolio. it's a deal-closing engine.
              </p>

              <div className="grid md:grid-cols-2 gap-6 text-base md:text-lg max-w-5xl mb-12">
                <div className="space-y-3">
                  <p className="text-green-300 uppercase tracking-[0.2em] text-xs">
                    positioning
                  </p>
                  <p>
                    notion + figma + chatgpt + airtable – focused solely on selling creative work.
                  </p>
                  <p>
                    all cases, versions, pitches in one system built for live situations, not archiving.
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-green-300 uppercase tracking-[0.2em] text-xs">
                    why it wins
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>first tool 100% optimized to close deals</li>
                    <li>eliminates pdf hell and version wars</li>
                    <li>makes clients co-creators – not passive viewers</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* accordion for features */}
            <div className="space-y-4">
              {/* case editor */}
              <div>
                <button
                  onClick={() => toggleAccordion("editor")}
                  className="w-full text-left text-3xl text-green-300 hover:text-white flex justify-between items-center"
                >
                  case editor
                  <span>{openAccordions.editor ? "-" : "+"}</span>
                </button>
                <AnimatePresence>
                  {openAccordions.editor && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2 mb-4 text-base">edit sample case (simulates live editing):</p>
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full h-28 bg-black/50 border border-green-600 rounded p-3 text-green-200 outline-none resize-none text-base"
                      />
                      <button
                        onClick={saveEdit}
                        className="mt-3 px-5 py-2 border border-green-400 rounded hover:bg-green-400 hover:text-black transition text-base"
                      >
                        save as new version
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ai narrative engine */}
              <div>
                <button
                  onClick={() => toggleAccordion("engine")}
                  className="w-full text-left text-3xl text-green-300 hover:text-white flex justify-between items-center"
                >
                  ai narrative engine
                  <span>{openAccordions.engine ? "-" : "+"}</span>
                </button>
                <AnimatePresence>
                  {openAccordions.engine && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2 mb-4 text-base">apply tone to current text:</p>
                      <div className="flex flex-wrap gap-3 mb-3">
                        {["corporate", "playful", "bold", "minimal"].map((t) => (
                          <button
                            key={t}
                            onClick={() => setTone(t as Tone)}
                            className={`px-3 py-1 border rounded text-base ${tone === t ? "bg-green-400 text-black" : "border-green-400 hover:bg-green-400 hover:text-black"} transition`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <input
                        value={customTone}
                        onChange={(e) => setCustomTone(e.target.value)}
                        placeholder="custom tone..."
                        className="w-full bg-black/50 border border-green-600 rounded p-3 text-green-200 outline-none mb-3 text-base"
                      />
                      <button
                        onClick={applyTone}
                        disabled={!tone && !customTone}
                        className="px-5 py-2 border border-green-400 rounded hover:bg-green-400 hover:text-black transition disabled:opacity-50 text-base"
                      >
                        apply
                      </button>
                      <p className="mt-3 text-base bg-black/40 p-3 rounded border border-green-500/50">
                        current: {sampleCaseText}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* version history */}
              <div>
                <button
                  onClick={() => toggleAccordion("history")}
                  className="w-full text-left text-3xl text-green-300 hover:text-white flex justify-between items-center"
                >
                  version history
                  <span>{openAccordions.history ? "-" : "+"}</span>
                </button>
                <AnimatePresence>
                  {openAccordions.history && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 mt-2">
                        {versions.map((v) => (
                          <div
                            key={v.id}
                            className={`flex justify-between items-center p-3 border rounded text-base ${currentVersion === v.id ? "border-green-300 bg-black/60" : "border-green-800/60"}`}
                          >
                            <span>version {v.id}: {v.timestamp}</span>
                            <button
                              onClick={() => rollbackVersion(v.id)}
                              className="px-3 py-1 border border-green-400 rounded hover:bg-green-400 hover:text-black transition text-base"
                            >
                              rollback
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* client mirror links */}
              <div>
                <button
                  onClick={() => toggleAccordion("mirror")}
                  className="w-full text-left text-3xl text-green-300 hover:text-white flex justify-between items-center"
                >
                  client mirror links
                  <span>{openAccordions.mirror ? "-" : "+"}</span>
                </button>
                <AnimatePresence>
                  {openAccordions.mirror && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <input
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="client name..."
                        className="w-full bg-black/50 border border-green-600 rounded p-3 text-green-200 outline-none mb-3 text-base"
                      />
                      <input
                        value={clientLogo}
                        onChange={(e) => setClientLogo(e.target.value)}
                        placeholder="logo url (optional)..."
                        className="w-full bg-black/50 border border-green-600 rounded p-3 text-green-200 outline-none mb-3 text-base"
                      />
                      <button
                        onClick={generateMirror}
                        disabled={!clientName.trim()}
                        className="px-5 py-2 border border-green-400 rounded hover:bg-green-400 hover:text-black transition disabled:opacity-50 text-base"
                      >
                        generate
                      </button>
                      {mirrorLink && (
                        <p className="mt-3 text-base bg-black/40 p-3 rounded border border-green-500/50">
                          link: <a href={mirrorLink} className="underline hover:text-white">{mirrorLink}</a> (mock)
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* one-click export */}
              <div>
                <button
                  onClick={() => toggleAccordion("export")}
                  className="w-full text-left text-3xl text-green-300 hover:text-white flex justify-between items-center"
                >
                  one-click export
                  <span>{openAccordions.export ? "-" : "+"}</span>
                </button>
                <AnimatePresence>
                  {openAccordions.export && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2 mb-3 text-base">select cases:</p>
                      <div className="space-y-2 mb-3">
                        {cases.map((c) => (
                          <div key={c.id} className="flex items-center gap-3 text-base">
                            <input
                              type="checkbox"
                              checked={c.selected}
                              onChange={() => toggleCaseSelection(c.id)}
                              className="form-checkbox bg-black/50 border-green-600 text-green-400 focus:ring-green-500"
                            />
                            <span>{c.title}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-3 mb-3">
                        {["pdf", "figma", "keynote"].map((f) => (
                          <button
                            key={f}
                            onClick={() => setExportFormat(f as "pdf" | "figma" | "keynote")}
                            className={`px-3 py-1 border rounded uppercase text-base ${exportFormat === f ? "bg-green-400 text-black" : "border-green-400 hover:bg-green-400 hover:text-black"} transition`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={exportDeck}
                        disabled={!exportFormat || !cases.some((c) => c.selected)}
                        className="px-5 py-2 border border-green-400 rounded hover:bg-green-400 hover:text-black transition disabled:opacity-50 text-base"
                      >
                        export
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* sub-command terminal */}
              <div>
                <button
                  onClick={() => toggleAccordion("editing")}
                  className="w-full text-left text-3xl text-green-300 hover:text-white flex justify-between items-center"
                >
                  sub-command terminal
                  <span>{openAccordions.editing ? "-" : "+"}</span>
                </button>
                <AnimatePresence>
                  {openAccordions.editing && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2 mb-3 text-base">run commands (type 'help' for list):</p>
                      <div className="bg-black/40 p-3 rounded border border-green-500/50 mb-3 text-base">
                        {liveOutput.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          runSubCommand(subCommand);
                        }}
                      >
                        <div className="flex items-center">
                          <span className="text-2xl">{">"}</span>
                          <input
                            value={subCommand}
                            onChange={(e) => setSubCommand(e.target.value)}
                            placeholder="type command..."
                            className="bg-transparent outline-none ml-4 text-base w-full font-light placeholder:text-green-700"
                          />
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-12 text-sm">
              <div className="text-green-300">
                invite-only beta · q1 2025 ·{" "}
                <span className="text-green-100">
                  solo · studio · agency (whitelabel)
                </span>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-green-400 rounded-full hover:bg-green-400 hover:text-black transition text-base">
                  join waitlist (coming soon)
                </button>
                <button
                  className="px-4 py-2 border border-green-700 rounded-full text-green-300 hover:border-green-300 transition text-base"
                  onClick={() => setSection("menu")}
                >
                  back to commands
                </button>
                <button
                  onClick={resetDemo}
                  className="px-4 py-2 border border-green-700 rounded-full text-green-300 hover:border-green-300 transition text-base"
                >
                  reset demo
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* feedback toast */}
      {feedbackMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-900/80 text-green-300 px-6 py-3 rounded-full text-base shadow-lg"
        >
          {feedbackMessage}
        </motion.div>
      )}

      {/* status bar */}
      <div className="bg-zinc-900/90 backdrop-blur px-8 md:px-10 py-3 md:py-4 border-t-2 border-green-500/40 flex justify-between text-xs md:text-sm font-light">
        <span>root@arvidgladh:~/the-vault</span>
        <span>{time ?? "--:--:--"}</span>
      </div>
    </div>
  );
}
