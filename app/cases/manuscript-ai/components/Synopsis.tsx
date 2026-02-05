export default function Synopsis({ text }: { text: string }) {
  return (
    <div className="bg-neutral-900 p-4 rounded-xl h-full">
      <h3 className="text-sm font-semibold mb-2 text-neutral-200">
        AI-genererad synopsis
      </h3>
      <p className="text-sm text-neutral-300 whitespace-pre-line leading-relaxed">
        {text}
      </p>
    </div>
  );
}
