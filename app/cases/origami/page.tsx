"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  Search,
  FileText,
  Brain,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Layers,
} from "lucide-react";

const marketData = [
  { year: "2024", value: 1200, label: "$1.2B" },
  { year: "2027", value: 2162, label: "$2.2B" },
  { year: "2033", value: 3800, label: "$3.8B" },
];

const competitorData = [
  { name: "Turnitin", accuracy: 100, price: "Högt", integration: "Exklusivt", color: "#fb7185" },
  { name: "GPTZero", accuracy: 84, price: "Medel", integration: "Begränsat", color: "#fbbf24" },
  { name: "Copyleaks", accuracy: 92, price: "Högt", integration: "Bra", color: "#a78bfa" },
  { name: "origami", accuracy: 98, price: "Flexibelt", integration: "Sömlöst", color: "#34d399" },
];

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  bg?: string;
};

function Section({
  children,
  className = "",
  id = "",
  bg = "bg-white",
}: SectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`min-h-screen flex items-center justify-center px-6 py-20 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${bg} ${className}`}
    >
      {children}
    </section>
  );
}

function Hero() {
  const [folded, setFolded] = useState(false);

  return (
    <Section
      bg="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50"
      className="relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-rose-200 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div
          className="inline-block mb-8 cursor-pointer transition-transform duration-700 hover:scale-110"
          onClick={() => setFolded(!folded)}
        >
          <div
            className={`text-8xl transition-all duration-700 ${
              folded ? "rotate-180 scale-75" : ""
            }`}
          >
            🦢
          </div>
        </div>

        <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          origami
        </h1>

        <p className="text-2xl md:text-3xl lg:text-4xl text-slate-700 font-light mb-4 max-w-4xl mx-auto leading-relaxed">
          Vik ihop fusk. Vik ut sanningen.
        </p>

        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto">
          AI-driven akademisk integritet för moderna utbildningsinstitutioner
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-rose-100">
            <div className="text-3xl font-bold text-rose-600">98%</div>
            <div className="text-xs text-slate-500 mt-1">Accuracy</div>
          </div>
          <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-purple-100">
            <div className="text-3xl font-bold text-purple-600">&lt; 2s</div>
            <div className="text-xs text-slate-500 mt-1">Analystid</div>
          </div>
          <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-indigo-100">
            <div className="text-3xl font-bold text-indigo-600">24/7</div>
            <div className="text-xs text-slate-500 mt-1">Tillgänglighet</div>
          </div>
        </div>

        <div className="relative w-full max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-xl border border-rose-100">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-rose-500 to-purple-500 text-white text-sm rounded-full">
            Live Demo
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
              <FileText className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Klistra in text eller ladda upp dokument..."
                className="flex-1 bg-transparent outline-none text-slate-700"
                readOnly
              />
              <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-shadow">
                Analysera
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, label: "Plagiat", value: "0%", color: "emerald" },
                { icon: Brain, label: "AI-genererat", value: "12%", color: "amber" },
                {
                  icon: CheckCircle,
                  label: "Originalitet",
                  value: "88%",
                  color: "emerald",
                },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl text-center">
                  {/* Obs: dynamiska Tailwind-klasser kan behöva safelist i tailwind.config
                      om du vill ha exakt färg, annars funkar det ändå men utan custom färg */}
                  <item.icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Market() {
  return (
    <Section bg="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
            En marknad i <span className="text-purple-600">explosion</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Anti-plagiat marknaden växer med 12.3% årligen och når $3.8 miljarder
            2033. Men ingen lösning är komplett.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-purple-100">
            <h3 className="text-2xl font-bold mb-6 text-slate-900">
              Marknadstillväxt
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={marketData}>
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                  {marketData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={["#f43f5e", "#a855f7", "#6366f1"][i]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: TrendingUp,
                title: "CAGR: 12.3%",
                desc: "Årlig tillväxt driven av digitalisering av utbildning",
                color: "rose",
              },
              {
                icon: Users,
                title: "71M+ studenter",
                desc: "Bara Turnitin täcker denna volym — market share finns att ta",
                color: "purple",
              },
              {
                icon: Target,
                title: "K-12 växer snabbast",
                desc: "14.5% CAGR i grundskole-segmentet",
                color: "indigo",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-50">
                    <item.icon className="w-6 h-6 text-slate-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-rose-100 via-purple-100 to-indigo-100 rounded-3xl p-10 border border-purple-200">
          <div className="flex items-start gap-6">
            <div className="text-5xl">🎯</div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Market Gap
              </h3>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Befintliga lösningar är antingen extremt dyra (Turnitin),
                otillräckligt noggranna (GPTZero), eller svåra att integrera
                (Copyleaks). Ingen kombinerar:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  "Multi-model AI för 98% accuracy",
                  "Flexibel prissättning för alla skolor",
                  "Plug-and-play LMS integration",
                ].map((text, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white/60 rounded-xl px-4 py-3"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Competitors() {
  return (
    <Section bg="bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6">
            Konkurrenter & <span className="text-purple-600">vårt USP</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Vi har analyserat marknaden och identifierat exakt var origami vinner
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {competitorData.map((comp, i) => (
            <div
              key={i}
              className={`p-6 rounded-3xl border-2 transition-all hover:scale-105 ${
                comp.name === "origami"
                  ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 shadow-lg"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div
                className={`text-4xl mb-4 ${
                  comp.name === "origami" ? "animate-bounce" : ""
                }`}
              >
                {comp.name === "origami" ? "🦢" : "🏢"}
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">
                {comp.name}
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Accuracy</span>
                    <span className="font-bold">{comp.accuracy}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${comp.accuracy}%`,
                        backgroundColor: comp.color,
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Pris</span>
                  <span className="font-medium">{comp.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Integration</span>
                  <span className="font-medium">{comp.integration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white rounded-3xl p-10">
          <h3 className="text-3xl font-bold mb-8">Vad gör origami unikt?</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Layers,
                title: "Multi-Model AI Architecture",
                desc: "Vi kombinerar Claude, GPT-4, och Gemini för cross-validation. Om en modell missar något, fångar de andra det. Resultat: 98% accuracy.",
              },
              {
                icon: Zap,
                title: "Real-Time Source Mapping",
                desc: 'Inte bara "detta är plagiat" — vi visar exakt varifrån, med direktlänkar till källan. Inkluderar alla akademiska databaser (JSTOR, PubMed, arXiv).',
              },
              {
                icon: Shield,
                title: "AI Bypasser Detection",
                desc: "Studenter använder QuillBot och Wordtune för att humanisera AI-text. Vi detekterar även parafraserad AI-generering.",
              },
              {
                icon: Target,
                title: "Zero False Positives för ESL",
                desc: "Många verktyg felaktigt flaggar icke-native engelska som AI. Vi är tränade på 50+ språk och dialekter.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function SolutionSection() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    {
      label: "Detektering",
      icon: Search,
      content:
        "Multi-model AI analyserar text genom 3 lager: (1) Semantisk likhet mot 2B+ dokument, (2) Stilistisk fingerprint för AI-generation, (3) Källreferens-validering.",
    },
    {
      label: "Rapport",
      icon: FileText,
      content:
        "Lärare får en visuell karta där varje mening är color-coded: grön (original), gul (osäker), röd (plagiat/AI). Klicka för att se exakt källa.",
    },
    {
      label: "Integration",
      icon: Layers,
      content:
        "En rad kod i Canvas/Blackboard/Moodle. Studenter submittar som vanligt, origami körs i bakgrunden. Läraren ser resultatet direkt i LMS.",
    },
  ];

  return (
    <Section bg="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6">
            Hur <span className="text-indigo-600">origami</span> fungerar
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Tre steg. Två sekunder. Noll kompromisser.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-indigo-100 mb-12">
          <div className="flex gap-4 mb-8 overflow-x-auto">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all whitespace-nowrap ${
                  activeTab === i
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[200px] bg-slate-50 rounded-2xl p-8">
            <p className="text-lg text-slate-700 leading-relaxed">
              {tabs[activeTab].content}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Upload",
              desc: "Drag & drop eller API integration",
              color: "rose",
            },
            {
              step: "02",
              title: "Analyze",
              desc: "AI processerar på &lt; 2 sekunder",
              color: "purple",
            },
            {
              step: "03",
              title: "Report",
              desc: "Interaktiv rapport med källor",
              color: "indigo",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="relative p-8 bg-white rounded-3xl border-2 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div
                className={`absolute -top-4 left-8 px-4 py-1 text-white text-sm font-bold rounded-full ${
                  item.color === "rose"
                    ? "bg-gradient-to-r from-rose-400 to-rose-600"
                    : item.color === "purple"
                    ? "bg-gradient-to-r from-purple-400 to-purple-600"
                    : "bg-gradient-to-r from-indigo-400 to-indigo-600"
                }`}
              >
                {item.step}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 mt-4">
                {item.title}
              </h3>
              <p className="text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function B2B() {
  return (
    <Section bg="bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            B2B-modellen som{" "}
            <span className="text-emerald-400">skalar</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            SaaS-prissättning designad för lönsamhet från dag 1
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              tier: "Starter",
              price: "29 kr",
              unit: "per student/år",
              features: [
                "Upp till 500 studenter",
                "Basic plagiatdetektering",
                "Email support",
              ],
              color: "from-rose-500 to-pink-500",
            },
            {
              tier: "Professional",
              price: "19 kr",
              unit: "per student/år",
              features: [
                "501-5000 studenter",
                "Full AI-detection",
                "LMS integration",
                "Priority support",
              ],
              color: "from-purple-500 to-indigo-500",
              popular: true,
            },
            {
              tier: "Enterprise",
              price: "Custom",
              unit: "kontakta oss",
              features: [
                "5000+ studenter",
                "White-label option",
                "Dedikerad account manager",
                "SLA garantier",
              ],
              color: "from-indigo-500 to-blue-500",
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={`relative p-8 bg-white/5 backdrop-blur-sm rounded-3xl border ${
                plan.popular
                  ? "border-purple-400 shadow-2xl scale-105"
                  : "border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full">
                  Mest populär
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.tier}</h3>
              <div
                className={`text-4xl font-bold mb-1 bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}
              >
                {plan.price}
              </div>
              <p className="text-sm text-slate-400 mb-6">{plan.unit}</p>
              <ul className="space-y-3">
                {plan.features.map((feature, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20">
          <h3 className="text-3xl font-bold mb-8">
            Revenue Model & Unit Economics
          </h3>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h4 className="text-xl font-bold mb-4 text-purple-300">
                LTV Calculation
              </h4>
              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span>Avg. price per student/år:</span>
                  <span className="font-bold text-white">22 kr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span>Avg. institution size:</span>
                  <span className="font-bold text-white">
                    2,500 students
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span>Avg. contract length:</span>
                  <span className="font-bold text-white">3 år</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-400/30 mt-4">
                  <span className="font-bold text-emerald-300">
                    LTV per institution:
                  </span>
                  <span className="font-bold text-2xl text-emerald-300">
                    165,000 kr
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-4 text-purple-300">
                CAC & Profitability
              </h4>
              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span>Sales cycle (B2B education):</span>
                  <span className="font-bold text-white">
                    3–6 månader
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span>CAC per institution:</span>
                  <span className="font-bold text-white">35,000 kr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span>Gross margin:</span>
                  <span className="font-bold text-white">85%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30 mt-4">
                  <span className="font-bold text-purple-300">
                    LTV:CAC ratio:
                  </span>
                  <span className="font-bold text-2xl text-purple-300">
                    4.7:1
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-400/30">
            <DollarSign className="w-8 h-8 text-emerald-400 mb-4" />
            <h4 className="text-xl font-bold mb-3">Path to Profitability</h4>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-purple-300 font-semibold mb-1">
                  Year 1
                </p>
                <p className="text-slate-300">100 institutioner → 5.5M ARR</p>
              </div>
              <div>
                <p className="text-purple-300 font-semibold mb-1">
                  Year 2
                </p>
                <p className="text-slate-300">
                  350 institutioner → 19M ARR
                </p>
              </div>
              <div>
                <p className="text-purple-300 font-semibold mb-1">
                  Year 3
                </p>
                <p className="text-slate-300">
                  750 institutioner → 41M ARR
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Reflection() {
  return (
    <Section bg="bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6">
            Reflection & Next Steps
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Vad jag lärde mig från detta projekt
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 text-emerald-600">
              What Worked
            </h3>
            <ul className="space-y-4 text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <strong>Multi-model approach:</strong> Research visar att
                  hybrid AI ger 14% högre accuracy än single-model
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <strong>Per-student pricing:</strong> Passar perfekt för
                  education market där budgetar är tight
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <strong>Pastel UI:</strong> Skiljer sig från konkurrenternas
                  kliniska design, skapar trust
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 text-rose-600">
              Challenges Ahead
            </h3>
            <ul className="space-y-4 text-slate-700">
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
                <div>
                  <strong>Data privacy:</strong> GDPR/FERPA compliance krävs för
                  student data
                </div>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
                <div>
                  <strong>Sales cycle:</strong> Education är notoriously slow
                  (6–12 månader)
                </div>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
                <div>
                  <strong>API costs:</strong> Multi-model innebär 3x compute cost
                  vs single AI
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-10 border border-purple-200 shadow-lg mb-12">
          <h3 className="text-3xl font-bold mb-6 text-slate-900">
            Next Iterations
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Browser Extension",
                desc: "Lärare kan checka text direkt i Google Docs/Canvas utan att lämna platformen",
              },
              {
                title: "Student Dashboard",
                desc: "Innan submission, studenter kan själva checka sitt arbete (pedagogiskt verktyg, inte bara policing)",
              },
              {
                title: "Citation Helper",
                desc: "Auto-generera APA/MLA citations för alla detekterade källor",
              },
              {
                title: "Trend Analytics",
                desc: "Institutioner ser vilka kurser/ämnen som har mest fusk, kan agera proaktivt",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100"
              >
                <h4 className="font-bold text-lg text-slate-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center bg-gradient-to-r from-slate-900 to-indigo-900 text-white rounded-3xl p-12">
          <h3 className="text-3xl font-bold mb-4">Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              "React",
              "TypeScript",
              "Tailwind",
              "Claude API",
              "GPT-4",
              "Gemini",
              "Recharts",
            ].map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm border border-white/20"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="pt-8 border-t border-white/20">
            <p className="text-slate-400 mb-2">Case Study av</p>
            <p className="text-2xl font-bold mb-1">Ditt Namn</p>
            <p className="text-slate-400">
              Product Designer • UX Researcher • Frontend Developer
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default function OrigamiCaseStudy() {
  return (
    <div className="font-sans antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Poppins', sans-serif;
          scroll-behavior: smooth;
        }
        
        h1, h2, h3 {
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.03em;
        }
        
        .number {
          font-family: 'Space Grotesk', monospace;
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <Hero />
      <Market />
      <Competitors />
      <SolutionSection />
      <B2B />
      <Reflection />
    </div>
  );
}
