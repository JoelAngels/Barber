'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
              isSuccess
                ? 'bg-zinc-900 text-stone-100 border-amber-500/30 dark:bg-zinc-900 dark:border-amber-500/40'
                : isError
                ? 'bg-red-950 text-red-100 border-red-500/30'
                : 'bg-zinc-900 text-stone-100 border-zinc-700'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-amber-500" />}
              {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-amber-400" />}
            </div>
            <div className="flex-1 text-sm">
              <p className="font-semibold text-stone-100">{toast.title}</p>
              {toast.message && <p className="text-stone-300 text-xs mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-stone-100 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
