/**
 * 功能：深色/浅色/跟随系统主题状态
 * 作者：FullStack-Guardian
 * 更新时间：2026-03-03
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'kunqiong-theme' }
  )
);

/** 解析当前实际生效的 theme：若为 system 则根据 prefers-color-scheme 返回 light 或 dark */
export function getEffectiveTheme(): 'light' | 'dark' {
  const theme = useThemeStore.getState().theme;
  if (theme === 'dark') return 'dark';
  if (theme === 'light') return 'light';
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}
