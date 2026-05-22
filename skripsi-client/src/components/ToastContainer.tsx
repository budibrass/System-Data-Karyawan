"use client";

import { useToastStore, ToastType } from "../store/useToastStore";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success": return <CheckCircle className="text-green-500" size={20} />;
      case "error": return <XCircle className="text-red-500" size={20} />;
      case "info": return <Info className="text-blue-500" size={20} />;
    }
  };

  const getStyles = (type: ToastType) => {
    switch (type) {
      case "success": return "border-green-100 bg-green-50 text-green-800";
      case "error": return "border-red-100 bg-red-50 text-red-800";
      case "info": return "border-blue-100 bg-blue-50 text-blue-800";
    }
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-right-5 ${getStyles(toast.type)}`}
        >
          {getIcon(toast.type)}
          <p className="text-sm font-semibold">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="ml-2 opacity-50 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}