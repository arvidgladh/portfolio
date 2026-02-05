"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useRef,
  ReactNode,
} from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    if (!message) return;
    const id = ++idRef.current;

    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  function removeToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed inset-x-0 top-2 z-50 flex justify-center pointer-events-none">
        <div className="w-full max-w-sm px-4 space-y-2">
          {toasts.map((toast) => {
            const base =
              "pointer-events-auto rounded-md border px-3 py-2 text-xs shadow-lg backdrop-blur transition-all duration-200";
            const typeClasses =
              toast.type === "success"
                ? "border-emerald-500/60 bg-emerald-900/80 text-emerald-50"
                : toast.type === "error"
                ? "border-red-500/60 bg-red-900/80 text-red-50"
                : "border-slate-600 bg-slate-900/80 text-slate-50";

            return (
              <div key={toast.id} className={`${base} ${typeClasses}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="leading-snug">{toast.message}</span>
                  <button
                    type="button"
                    onClick={() => removeToast(toast.id)}
                    className="ml-2 text-[10px] text-slate-300 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
