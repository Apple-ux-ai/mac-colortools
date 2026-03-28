import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../store/toastStore';

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="pointer-events-auto"
          >
            <div className="bg-white/80 dark:bg-slate-700/95 backdrop-blur-xl border border-slate-100 dark:border-slate-600 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl p-4 flex items-center gap-3 min-w-[240px]">
              <div className={`p-2 rounded-xl ${
                toast.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-500 dark:text-emerald-400' :
                toast.type === 'error' ? 'bg-rose-50 dark:bg-rose-900/50 text-rose-500 dark:text-rose-400' :
                'bg-blue-50 dark:bg-blue-900/50 text-blue-500 dark:text-blue-400'
              }`}>
                {toast.type === 'success' && <CheckCircle2 size={20} />}
                {toast.type === 'error' && <AlertCircle size={20} />}
                {toast.type === 'info' && <Info size={20} />}
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{toast.message}</p>
              </div>

              <button 
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg text-slate-300 dark:text-slate-400 hover:text-slate-500 dark:hover:text-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
