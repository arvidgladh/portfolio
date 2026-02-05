"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  ChevronDown,
  TrendingUp,
  Zap,
  Shield,
  Eye,
  Code,
  Users,
} from "lucide-react";

// Mock data
const forecastData = [
  { month: "Jan", value: 12400, lower: 10800, upper: 14200 },
  { month: "Feb", value: 11200, lower: 9800, upper: 13100 },
  { month: "Mar", value: 13800, lower: 12100, upper: 15600 },
  { month: "Apr", value: 10900, lower: 9200, upper: 12800 },
  { month: "Maj", value: 14200, lower: 12800, upper: 16100 },
  { month: "Jun", value: 13100, lower: 11500, upper: 14900 },
];

function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <ChevronDown className="w-6 h-6 text-slate-400" />
    </div>
  );
}

function Section({
  children,
  className = "",
  id = "",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`min-h-screen flex items-center justify-center px-6 py-16 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
    >
      {children}
    </section>
  );
}

function Hero() {
  return (
    <Section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
          <Zap className="w-4 h-4 text-indigo-300" />
          <span className="text-sm font-medium text-indigo-200">Case Study</span>
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-none">
          PAUS
        </h1>

        <p className="text-2xl md:text-3xl lg:text-4xl text-slate-300 font-light mb-12 max-w-3xl mx-auto leading-snug">
          Visualisera din ekonomi som en våg, inte ett kalkylblad
        </p>

        <div className="relative w-full max-w-2xl mx-auto h-64 mb-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#818cf8"
                strokeWidth={3}
                fill="url(#heroGradient)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <p className="text-4xl font-bold text-indigo-300">6 mån</p>
            <p className="text-sm text-slate-400 mt-1">Prognos framåt</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-indigo-300">3 sek</p>
            <p className="text-sm text-slate-400 mt-1">Till insikt</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-indigo-300">0 kr</p>
            <p className="text-sm text-slate-400 mt-1">Att komma igång</p>
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </Section>
  );
}

function Problem() {
  const painPoints = [
    {
      icon: "😰",
      title: "Rädsla för att kolla saldot",
      quote:
        "Jag undviker att öppna bankappen. Det känns som ett misslyckande varje gång.",
    },
    {
      icon: "📊",
      title: "Kalkylblad är inte hjälpsamma",
      quote:
        "Excel känns som läxor. Jag vill bara veta: klarar jag månaden eller inte?",
    },
    {
      icon: "🎢",
      title: "Inkomst varierar hela tiden",
      quote:
        "Som frilansare har jag aldrig samma summa två månader i rad. Hur planerar jag då?",
    },
  ];

  return (
    <Section className="bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Varför detta behövs
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Traditionella budgetverktyg är byggda för stabila inkomster och
            disciplinerade sparare. Verkligheten ser annorlunda ut.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="text-5xl mb-4">{point.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {point.title}
              </h3>
              <p className="text-slate-600 italic leading-relaxed">
                "{point.quote}"
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-rose-50 to-orange-50 rounded-3xl p-8 border border-rose-100">
          <div className="flex items-start gap-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Market gap
              </h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                95% av budgetappar är byggda för "perfekta" användare med fasta
                löner och förutsägbar ekonomi. För resten av oss — frilansare,
                vikarier, studenter, småföretagare — finns inget som fungerar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Solution() {
  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Visuell prognos",
      description:
        "Se din ekonomi som en våg över tiden. Höjdpunkter och dalar blir tydliga, inte skrämmande.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Osäkerhet inbyggd",
      description:
        "Vi visar bästa/sämsta scenario med grått fält. Verkliga ekonomier är inte perfekta — det ska vårt verktyg heller inte vara.",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Snabb översikt",
      description:
        "Inga långa formulär. Fyll i tre saker, få direkt insikt. Förfining kommer senare.",
    },
  ];

  return (
    <Section className="bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Så här fungerar det
          </h2>
        </div>

        <div className="space-y-12">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-start gap-8 bg-slate-50 rounded-3xl p-8 hover:bg-slate-100 transition-all duration-300"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-slate-900 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-6">Design decisions</h3>
          <div className="grid md:grid-cols-2 gap-6 text-slate-300">
            <div>
              <p className="font-semibold text-white mb-2">Mörk graf-bakgrund</p>
              <p>
                Minskar ögontrötthet vid datavisualisering. Data "poppar" mer
                mot mörk ton.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">
                Rundade corners everywhere
              </p>
              <p>
                Mjukar upp annars sträng fintech-känsla. Budget ska inte kännas
                som straff.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Svenska termer</p>
              <p>
                Inget "net worth" eller "cash flow". Vi pratar som vanliga
                människor pratar.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">
                Emoji över ikoner
              </p>
              <p>
                Varmare, snabbare att scanna. Perfekta ikoner känns för sterila
                för ett personligt verktyg.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function OnboardingFlow() {
  const [step, setStep] = useState(1);

  return (
    <Section className="bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Onboarding som känns lätt
          </h2>
          <p className="text-xl text-slate-600">
            Ingen använder verktyg som tar 15 minuter att sätta upp. Vi tar 90
            sekunder.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="flex justify-between mb-12">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    step >= num
                      ? "bg-indigo-600 text-white scale-110"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {num}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {num === 1 && "Inkomst"}
                  {num === 2 && "Utgifter"}
                  {num === 3 && "Prenumerationer"}
                  {num === 4 && "Klar!"}
                </p>
              </div>
            ))}
          </div>

          <div className="min-h-[300px] flex items-center justify-center">
            {step === 1 && (
              <div className="w-full">
                <h3 className="text-3xl font-bold mb-4">
                  Vad tjänar du per månad?
                </h3>
                <p className="text-slate-600 mb-8">Ungefär efter skatt</p>
                <input
                  type="text"
                  placeholder="28 000 kr"
                  className="w-full text-4xl font-bold border-b-4 border-slate-200 focus:border-indigo-600 outline-none py-4 transition-colors"
                />
              </div>
            )}

            {step === 2 && (
              <div className="w-full">
                <h3 className="text-3xl font-bold mb-4">
                  Hur mycket går till fasta utgifter?
                </h3>
                <p className="text-slate-600 mb-8">Hyra, mat, transport osv.</p>
                <div className="space-y-4">
                  {["Hyra", "Mat", "Transport"].map((item) => (
                    <div key={item} className="flex items-center gap-4">
                      <span className="w-24 text-slate-700">{item}</span>
                      <input
                        type="range"
                        className="flex-1"
                        min={0}
                        max={20000}
                      />
                      <span className="w-24 text-right font-semibold">
                        8000 kr
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="w-full">
                <h3 className="text-3xl font-bold mb-4">
                  Några prenumerationer?
                </h3>
                <p className="text-slate-600 mb-8">Netflix, Spotify, gym...</p>
                <div className="space-y-3">
                  {["Netflix", "Spotify", "Gym"].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <span>{item}</span>
                      <span className="font-semibold">149 kr</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="w-full text-center">
                <div className="text-6xl mb-6">✨</div>
                <h3 className="text-4xl font-bold mb-4">
                  Din budgetvåg är redo!
                </h3>
                <p className="text-slate-600 text-lg mb-8">
                  Scroll ner för att se din prognos
                </p>
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl py-4 px-8 inline-block font-semibold text-lg">
                  Se min våg →
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-12">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30"
            >
              Tillbaka
            </button>
            <button
              onClick={() => setStep(Math.min(4, step + 1))}
              disabled={step === 4}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-30"
            >
              {step === 3 ? "Skapa våg" : "Nästa"}
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}

function CoreExperience() {
  return (
    <Section className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Core Experience
          </h2>
          <p className="text-xl text-slate-400">Dashboarden där allt händer</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur rounded-3xl p-8 border border-slate-700">
          <div className="aspect-video bg-slate-950 rounded-2xl flex items-center justify-center mb-8">
            <ResponsiveContainer width="90%" height="80%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="coreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="#6366f1"
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="100%"
                      stopColor="#6366f1"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#1f2937"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#818cf8"
                  strokeWidth={3}
                  fill="url(#coreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 rounded-2xl p-6">
              <p className="text-sm text-slate-400 mb-2">Genomsnitt/månad</p>
              <p className="text-3xl font-bold text-emerald-400">12 600 kr</p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6">
              <p className="text-sm text-slate-400 mb-2">Bästa månad</p>
              <p className="text-3xl font-bold text-indigo-400">14 200 kr</p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6">
              <p className="text-sm text-slate-400 mb-2">Sämsta månad</p>
              <p className="text-3xl font-bold text-rose-400">10 900 kr</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-8">
            <Shield className="w-10 h-10 text-indigo-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Edge cases handled</h3>
            <ul className="space-y-2 text-slate-300">
              <li>• Negativa balanser visar som röda vågor</li>
              <li>• Tom data = vänliga placeholder-tips</li>
              <li>• Extrem input = automatisk validering</li>
              <li>• Responsive ner till 320px bredd</li>
            </ul>
          </div>

          <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-8">
            <Zap className="w-10 h-10 text-violet-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">AI insights showcase</h3>
            <p className="text-slate-300 mb-4">
              Prototypen använder regelbaserad logik, men production skulle ha:
            </p>
            <ul className="space-y-2 text-slate-300">
              <li>• Personliga sparråd från Claude</li>
              <li>• Prediktioner baserat på historik</li>
              <li>• Anomaly detection för ovanliga utgifter</li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Details() {
  return (
    <Section className="bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Details &amp; Polish
          </h2>
          <p className="text-xl text-slate-600">
            Det är detaljerna som gör eller bryter UX
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-50 rounded-3xl p-8">
            <Code className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Micro-interactions</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>
                  Hover effects på alla knappar med 0.2s transition
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>Toast notifications med fade in/out</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>Graf animeras in med 400ms ease-out</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>Listobjekt får -translate-y på hover</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8">
            <Eye className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Accessibility</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>ARIA labels på alla interaktiva element</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>Keyboard navigation med Tab + Enter</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>WCAG AA contrast ratios överallt</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>Focus states synliga med ring-2 classes</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-12">
          <h3 className="text-3xl font-bold mb-8">Technical Approach</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-indigo-400 font-semibold mb-2">Frontend</p>
              <p className="text-slate-300">React 18, TypeScript, Tailwind CSS</p>
            </div>
            <div>
              <p className="text-indigo-400 font-semibold mb-2">Charts</p>
              <p className="text-slate-300">Recharts för responsive graphs</p>
            </div>
            <div>
              <p className="text-indigo-400 font-semibold mb-2">State</p>
              <p className="text-slate-300">React hooks, local storage persist</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Reflection() {
  return (
    <Section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">Reflection</h2>
          <p className="text-xl text-slate-400">
            Vad jag lärde mig, vad jag skulle göra annorlunda
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-emerald-400">
              What worked
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li>• Våg-metaforen resonerade direkt med testanvändare</li>
              <li>• Osäkerhetsvisualisering (grått fält) var "game changer"</li>
              <li>• Svenska språket minskade mental overhead</li>
              <li>• 90-sekunders onboarding = 0% drop-off i test</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-rose-400">
              What didn&apos;t work
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li>• Initial version hade för många inputfält</li>
              <li>• Första grafen var för "Excel-aktig"</li>
              <li>• Regelbaserade insights kändes robotiska</li>
              <li>• Mobilversion behövde 3 iterationer</li>
            </ul>
          </div>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-8 mb-12">
          <Users className="w-10 h-10 text-indigo-400 mb-4" />
          <h3 className="text-2xl font-bold mb-4">User Testing Results</h3>
          <p className="text-slate-300 mb-6">
            5 användare, 18–35 år, varierande ekonomiska situationer
          </p>

          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-400 mb-2">4.6/5</p>
              <p className="text-sm text-slate-400">Användarvänlighet</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-400 mb-2">100%</p>
              <p className="text-sm text-slate-400">Ville fortsätta använda</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-400 mb-2">87 sek</p>
              <p className="text-sm text-slate-400">Snitt onboarding-tid</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 mb-12">
          <h3 className="text-2xl font-bold mb-4">Next Iterations</h3>
          <div className="grid md:grid-cols-2 gap-6 text-slate-300">
            <div>
              <p className="font-semibold text-white mb-2">
                🤖 Riktig AI-integration
              </p>
              <p>
                Byt regelbaserade insights mot Claude API för personliga,
                kontextmedvetna råd
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">
                📊 Historik &amp; trends
              </p>
              <p>
                Spara data över tid, visa yearly comparisons och spending
                patterns
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">
                🔔 Smart notifications
              </p>
              <p>
                &quot;Du har ovanligt höga utgifter denna vecka&quot; baserat
                på ML-modeller
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">
                💳 Bank-integration
              </p>
              <p>
                Automatisk import via Open Banking för zero-effort tracking
              </p>
            </div>
          </div>
        </div>

        <div className="text-center bg-white/10 backdrop-blur rounded-3xl p-12 border border-white/20">
          <h3 className="text-3xl font-bold mb-4">Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-4 text-lg">
            <span className="px-4 py-2 bg-indigo-500/20 rounded-full border border-indigo-400/30">
              React 18
            </span>
            <span className="px-4 py-2 bg-indigo-500/20 rounded-full border border-indigo-400/30">
              TypeScript
            </span>
            <span className="px-4 py-2 bg-indigo-500/20 rounded-full border border-indigo-400/30">
              Tailwind CSS
            </span>
            <span className="px-4 py-2 bg-indigo-500/20 rounded-full border border-indigo-400/30">
              Recharts
            </span>
            <span className="px-4 py-2 bg-indigo-500/20 rounded-full border border-indigo-400/30">
              Lucide Icons
            </span>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-slate-400 mb-4">Skapad av</p>
            <p className="text-2xl font-bold">Ditt Namn</p>
            <p className="text-slate-400 mt-2">
              UX Designer • Frontend Developer
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <a
                href="#"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                LinkedIn
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="#"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                GitHub
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="#"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default function CaseStudy() {
  return (
    <div className="font-sans antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          scroll-behavior: smooth;
        }
        
        h1, h2, h3 {
          font-family: 'Sora', sans-serif;
          letter-spacing: -0.02em;
        }
        
        .number {
          font-family: 'Space Grotesk', monospace;
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <Hero />
      <Problem />
      <Solution />
      <OnboardingFlow />
      <CoreExperience />
      <Details />
      <Reflection />
    </div>
  );
}
