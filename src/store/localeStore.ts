/**
 * 多语言模块 - 当前语言状态与持久化
 * 独立于业务，仅被 LanguageSwitcher 与 i18n 初始化使用
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LocaleCode } from '../i18n/types';
import { DEFAULT_LOCALE } from '../i18n/types';

interface LocaleState {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'kunqiong-locale' }
  )
);
