export default function ScoreBadge({ score }: { score: number }) {
  const labels = [
    "1 — Auto-reject",
    "2 — Svag passform",
    "3 — Kan fungera med arbete",
    "4 — Hög potential",
    "5 — Läs NU",
  ];

  const bg = [
    "bg-red-900",
    "bg-red-800",
    "bg-amber-700",
    "bg-lime-700",
    "bg-emerald-600",
  ][score - 1];

  return (
    <div
      className={`text-center font-semibold text-xl py-3 px-4 rounded-xl ${bg}`}
    >
      ⭐ {score} / 5
      <p className="text-xs mt-1 opacity-90">{labels[score - 1]}</p>
    </div>
  );
}
