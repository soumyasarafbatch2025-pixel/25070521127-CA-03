import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts = [], onCloseToast }) {
  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((toast) => {
      return setTimeout(() => {
        onCloseToast(toast.id);
      }, toast.duration || 3500);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [toasts, onCloseToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`toast ${
              isSuccess ? 'toast-success' : isError ? 'toast-error' : 'toast-info'
            }`}
          >
            {isSuccess && <CheckCircle2 size={18} style={{ flexShrink: 0 }} />}
            {isError && <AlertCircle size={18} style={{ flexShrink: 0 }} />}
            {!isSuccess && !isError && <Info size={18} style={{ flexShrink: 0 }} />}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => onCloseToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'currentColor',
                cursor: 'pointer',
                padding: 2,
                display: 'flex',
                alignItems: 'center',
                opacity: 0.8,
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
