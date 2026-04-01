"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import type { Toast as ToastType, ToastType as TType } from "@/types";

const icons: Record<TType, React.ReactNode> = {
  success: <CheckCircle2 size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

const styles: Record<TType, string> = {
  success:
    "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-200",
  error:
    "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/80 dark:border-red-800 dark:text-red-200",
  warning:
    "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/80 dark:border-amber-800 dark:text-amber-200",
  info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/80 dark:border-blue-800 dark:text-blue-200",
};

const iconStyles: Record<TType, string> = {
  success: "text-emerald-500",
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-blue-500",
};

interface ToastItemProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleRemove = () => {
    setVisible(false);
    setTimeout(() => onRemove(toast.id), 200);
  };

  return (
    <div
      role="alert"
      className={`flex w-full max-w-xs sm:max-w-sm items-start gap-3 rounded-2xl border p-3 sm:p-4 shadow-lg transition-all duration-200 ${
        styles[toast.type]
      } ${visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
    >
      <span className={`mt-0.5 shrink-0 flex-shrink-0 ${iconStyles[toast.type]}`}>
        {icons[toast.type]}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-semibold">{toast.title}</p>
        {toast.message && (
          <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs opacity-80">{toast.message}</p>
        )}
      </div>
      <button
        onClick={handleRemove}
        className="shrink-0 rounded-lg p-1.5 sm:p-1 opacity-60 hover:opacity-100 transition-opacity min-h-8 min-w-8"
        aria-label="Dismiss notification"
      >
        <X size={16} className="sm:size-[14px]" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}
