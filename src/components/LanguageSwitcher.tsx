/**
 * 多语言切换器 - 仅负责 UI 与 locale 状态，不参与业务逻辑
 */
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore } from '../store/localeStore';
import i18n from '../i18n';
import { SUPPORTED_LOCALES, LANGUAGE_NAMES, type LocaleCode } from '../i18n/types';

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocaleStore();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // 与持久化语言同步（含 rehydrate 后）
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LocaleCode) => {
    setLocale(code);
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-300"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t('common.language')}
      >
        <Globe size={18} />
        <span className="text-sm font-bold">{LANGUAGE_NAMES[locale]}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            role="listbox"
            className="absolute right-0 mt-2 py-2 min-w-[12rem] max-h-[70vh] overflow-y-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl z-[110]"
          >
            {SUPPORTED_LOCALES.map((code) => (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={locale === code}
                onClick={() => handleSelect(code)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  locale === code
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {LANGUAGE_NAMES[code]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
