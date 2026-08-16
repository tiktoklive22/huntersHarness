import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none no-print">
      {toasts.map((toast) => {
        let borderClass = 'border-blue-200 bg-white text-blue-900 shadow-md';
        let Icon = Info;
        let iconClass = 'text-blue-600';

        if (toast.type === 'success') {
          borderClass = 'border-emerald-200 bg-white text-emerald-950 shadow-md';
          Icon = CheckCircle2;
          iconClass = 'text-emerald-600';
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-200 bg-white text-rose-950 shadow-md';
          Icon = AlertCircle;
          iconClass = 'text-rose-600';
        }

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${borderClass}`}
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
              <Icon className={`w-4 h-4 shrink-0 ${iconClass}`} />
              <span>{toast.title}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
