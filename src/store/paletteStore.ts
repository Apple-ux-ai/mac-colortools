/**
 * 功能：色板收藏与调色板管理状态
 * 作者：FullStack-Guardian
 * 更新时间：2026-03-03
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Palette {
  id: string;
  name: string;
  colors: string[];
  createdAt: number;
}

interface PaletteState {
  palettes: Palette[];
  /** 其他页面拾取/选择的颜色，可在调色板管理页一键加入色板 */
  lastPickedColor: string | null;
  addPalette: (name: string) => string;
  removePalette: (id: string) => void;
  updatePaletteName: (id: string, name: string) => void;
  addColorToPalette: (paletteId: string, color: string) => void;
  removeColorFromPalette: (paletteId: string, colorIndex: number) => void;
  reorderColorsInPalette: (paletteId: string, fromIndex: number, toIndex: number) => void;
  setLastPickedColor: (color: string | null) => void;
  importPalettes: (palettes: Omit<Palette, 'id' | 'createdAt'>[]) => void;
  exportPalette: (id: string) => string;
  exportAll: () => string;
}

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

export const usePaletteStore = create<PaletteState>()(
  persist(
    (set, get) => ({
      palettes: [],
      lastPickedColor: null,

      addPalette: (name: string) => {
        const id = generateId();
        const palette: Palette = {
          id,
          name: name || '未命名色板',
          colors: [],
          createdAt: Date.now(),
        };
        set((state) => ({
          palettes: [...state.palettes, palette],
        }));
        return id;
      },

      removePalette: (id: string) => {
        set((state) => ({
          palettes: state.palettes.filter((p) => p.id !== id),
        }));
      },

      updatePaletteName: (id: string, name: string) => {
        set((state) => ({
          palettes: state.palettes.map((p) =>
            p.id === id ? { ...p, name: name || p.name } : p
          ),
        }));
      },

      addColorToPalette: (paletteId: string, color: string) => {
        const normalized = color.trim().startsWith('#') ? color.trim() : `#${color.trim()}`;
        set((state) => ({
          palettes: state.palettes.map((p) => {
            if (p.id !== paletteId) return p;
            if (p.colors.includes(normalized)) return p;
            return { ...p, colors: [...p.colors, normalized] };
          }),
        }));
      },

      removeColorFromPalette: (paletteId: string, colorIndex: number) => {
        set((state) => ({
          palettes: state.palettes.map((p) => {
            if (p.id !== paletteId) return p;
            const next = [...p.colors];
            next.splice(colorIndex, 1);
            return { ...p, colors: next };
          }),
        }));
      },

      reorderColorsInPalette: (paletteId: string, fromIndex: number, toIndex: number) => {
        set((state) => ({
          palettes: state.palettes.map((p) => {
            if (p.id !== paletteId) return p;
            const next = [...p.colors];
            const [removed] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, removed);
            return { ...p, colors: next };
          }),
        }));
      },

      setLastPickedColor: (color: string | null) => {
        set({ lastPickedColor: color });
      },

      importPalettes: (palettes: Omit<Palette, 'id' | 'createdAt'>[]) => {
        const now = Date.now();
        const newPalettes: Palette[] = palettes.map((p) => ({
          ...p,
          id: generateId(),
          createdAt: now,
        }));
        set((state) => ({
          palettes: [...state.palettes, ...newPalettes],
        }));
      },

      exportPalette: (id: string) => {
        const palette = get().palettes.find((p) => p.id === id);
        if (!palette) return '[]';
        return JSON.stringify(
          [{ name: palette.name, colors: palette.colors }],
          null,
          2
        );
      },

      exportAll: () => {
        const palettes = get().palettes.map((p) => ({
          name: p.name,
          colors: p.colors,
        }));
        return JSON.stringify(palettes, null, 2);
      },
    }),
    {
      name: 'kunqiong-palette-storage',
      partialize: (state) => ({ palettes: state.palettes }),
    }
  )
);
