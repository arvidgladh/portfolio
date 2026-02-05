"use client";

import React from "react";
import { ToastProvider } from "./ToastProvider";

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          {children}
        </div>
      </main>
    </ToastProvider>
  );
}
