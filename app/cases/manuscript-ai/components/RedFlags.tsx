export default function RedFlags({ flags }: { flags: string[] }) {
  if (!flags || flags.length === 0) {
    return (
      <div className="bg-neutral-900 p-4 rounded-xl h-full">
        <h3 className="text-sm font-semibold mb-2 text-neutral-200">
          Red flags
        </h3>
        <p className="text-sm text-neutral-400">
          Inga tydliga varningssignaler i den här mock-analysen.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 p-4 rounded-xl h-full">
      <h3 className="text-sm font-semibold mb-2 text-neutral-200">
        Red flags
      </h3>
      <ul className="space-y-1">
        {flags.map((flag, i) => (
          <li key={i} className="text-sm text-neutral-300">
            ⚠️ {flag}
          </li>
        ))}
      </ul>
    </div>
  );
}
