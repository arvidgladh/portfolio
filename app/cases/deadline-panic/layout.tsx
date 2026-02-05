import type { ReactNode } from "react";

export default function DeadlinePanicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F5F2] text-[#111827] antialiased">
      {children}
    </div>
  );
}
