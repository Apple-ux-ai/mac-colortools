/**
 * 功能：调色板管理 - 色板收藏、多组色板、导入导出
 * 作者：FullStack-Guardian
 * 更新时间：2026-03-03
 */
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/PageContainer';
import { colord } from 'colord';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  Palette,
  GripVertical,
  Check,
  X,
  Heart,
} from 'lucide-react';
import { usePaletteStore, type Palette as PaletteType } from '../../store/paletteStore';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

const PaletteManager: React.FC = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addToast = useToastStore((s) => s.addToast);
  const {
    palettes,
    lastPickedColor,
    addPalette,
    removePalette,
    updatePaletteName,
    addColorToPalette,
    removeColorFromPalette,
    setLastPickedColor,
    importPalettes,
    exportPalette,
    exportAll,
  } = usePaletteStore();

  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState('');
  const [addColorInput, setAddColorInput] = useState<Record<string, string>>({});
  const [expandedPaletteId, setExpandedPaletteId] = useState<string | null>(
    palettes[0]?.id ?? null
  );
  /** 待确认删除的色板，用于显示自定义确认弹窗（替代原生 confirm） */
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!confirmDelete) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConfirmDelete(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmDelete]);

  const normalizeToHex = (input: string): string | null => {
    const c = colord(input.trim());
    return c.isValid() ? c.toHex() : null;
  };

  const handleCreatePalette = () => {
    const name = t('queryPalette.newPaletteName', { count: palettes.length + 1 });
    const id = addPalette(name);
    setExpandedPaletteId(id);
    setEditingNameId(id);
    setEditingNameValue(name);
    addToast(t('queryPalette.created'));
  };

  const handleStartEditName = (p: PaletteType) => {
    setEditingNameId(p.id);
    setEditingNameValue(p.name);
  };

  const handleSaveEditName = (id: string) => {
    if (editingNameValue.trim()) {
      updatePaletteName(id, editingNameValue.trim());
      addToast(t('queryPalette.updatedName'));
    }
    setEditingNameId(null);
  };

  const handleAddColor = (paletteId: string, colorOrUseLast?: string) => {
    const toAdd =
      colorOrUseLast === undefined
        ? addColorInput[paletteId]?.trim()
        : colorOrUseLast;
    if (!toAdd) {
      if (!colorOrUseLast) addToast(t('queryPalette.enterOrPickColor'), 'info');
      return;
    }
    const hex = normalizeToHex(toAdd);
    if (!hex) {
      addToast(t('queryPalette.invalidColor'), 'error');
      return;
    }
    addColorToPalette(paletteId, hex);
    setAddColorInput((prev) => ({ ...prev, [paletteId]: '' }));
    if (colorOrUseLast === lastPickedColor) setLastPickedColor(null);
    addToast(t('queryPalette.added'));
  };

  const handleCopyColor = async (hex: string) => {
    const success = await copyToClipboard(hex.toUpperCase());
    if (success) addToast(t('toast.copySuccessPlain', { value: hex.toUpperCase() }));
    else addToast(t('toast.copyFailRetry'), 'error');
  };

  const handleExportOne = (id: string) => {
    const json = exportPalette(id);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-${id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast(t('queryPalette.exportedOne'));
  };

  const handleExportAll = () => {
    const json = exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palettes-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast(t('queryPalette.exportedAll'));
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const data = JSON.parse(text);
        const list = Array.isArray(data) ? data : [data];
        const toImport = list
          .map((item: { name?: string; colors?: string[] }) => {
            const name = item.name ?? t('queryPalette.importedPaletteName');
            const colors = Array.isArray(item.colors)
              ? item.colors.filter((c) => colord(c).isValid()).map((c) => colord(c).toHex())
              : [];
            return { name, colors };
          })
          .filter((item: { colors: string[] }) => item.colors.length > 0 || true);
        if (toImport.length === 0) {
          addToast(t('queryPalette.noValidImport'), 'error');
          return;
        }
        importPalettes(toImport);
        addToast(t('queryPalette.importedCount', { count: toImport.length }));
      } catch {
        addToast(t('queryPalette.importFailed'), 'error');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <PageContainer title={t('queryPalette.title')} showBack={true}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 工具栏 */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCreatePalette}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={20} />
            {t('queryPalette.create')}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-600/60 hover:border-slate-300 dark:hover:border-slate-500 transition-all"
          >
            <Upload size={20} />
            {t('queryPalette.import')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImport}
          />
          <button
            onClick={handleExportAll}
            disabled={palettes.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-600/60 hover:border-slate-300 dark:hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Download size={20} />
            {t('queryPalette.exportAll')}
          </button>
        </div>

        {/* 当前拾取颜色 - 一键加入 */}
        {lastPickedColor && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl flex items-center gap-4 flex-wrap"
          >
            <span className="text-sm font-bold text-indigo-800 dark:text-indigo-300">{t('queryPalette.currentPicked')}</span>
            <div
              className="w-10 h-10 rounded-xl border-2 border-white dark:border-slate-600 shadow-md shrink-0"
              style={{ backgroundColor: lastPickedColor }}
            />
            <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
              {lastPickedColor.toUpperCase()}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-sm">{t('queryPalette.addToPalette')}</span>
            <button
              onClick={() => setLastPickedColor(null)}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-medium"
            >
              {t('queryPalette.clear')}
            </button>
          </motion.div>
        )}

        {/* 空状态 */}
        {palettes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-600 shadow-sm p-16 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <Palette className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">{t('queryPalette.noPalette')}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{t('queryPalette.noPaletteHint')}</p>
            <button
              onClick={handleCreatePalette}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold"
            >
              <Plus size={20} />
              {t('queryPalette.create')}
            </button>
          </motion.div>
        )}

        {/* 色板列表 */}
        <div className="space-y-4">
          <AnimatePresence>
            {palettes.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-600 shadow-sm overflow-hidden"
              >
                {/* 色板头部 */}
                <div
                  className="flex items-center gap-3 p-4 border-b border-slate-50 dark:border-slate-600 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors"
                  onClick={() =>
                    setExpandedPaletteId((id) => (id === p.id ? null : p.id))
                  }
                >
                  <GripVertical className="w-5 h-5 text-slate-300 shrink-0" />
                  {editingNameId === p.id ? (
                    <div className="flex-1 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingNameValue}
                        onChange={(e) => setEditingNameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEditName(p.id);
                          if (e.key === 'Escape') setEditingNameId(null);
                        }}
                        className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-500 rounded-lg font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEditName(p.id)}
                        className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 rounded-lg"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => setEditingNameId(null)}
                        className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className="flex-1 font-bold text-slate-800 dark:text-slate-100"
                        onDoubleClick={() => handleStartEditName(p)}
                      >
                        {p.name}
                      </span>
                      <span className="text-sm text-slate-400 dark:text-slate-500">
                        {t('common.colorsCount', { count: p.colors.length })}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportOne(p.id);
                        }}
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-lg transition-colors"
                        title={t('queryPalette.exportPalette')}
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete({ id: p.id, name: p.name });
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/40 rounded-lg transition-colors"
                        title={t('queryPalette.deletePalette')}
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>

                {/* 展开内容：色块 + 添加颜色 */}
                <AnimatePresence>
                  {expandedPaletteId === p.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 space-y-4">
                        {/* 色块列表 */}
                        <div className="flex flex-wrap gap-3">
                          {p.colors.map((hex, idx) => (
                            <motion.div
                              key={`${hex}-${idx}`}
                              layout
                              className="group relative flex items-center gap-1 bg-slate-50 dark:bg-slate-700/60 rounded-xl p-1 pr-2 border border-slate-100 dark:border-slate-600"
                            >
                              <div
                                className="w-10 h-10 rounded-lg border border-slate-200/80 dark:border-slate-500 shadow-inner shrink-0 cursor-pointer"
                                style={{ backgroundColor: hex }}
                                onClick={() => handleCopyColor(hex)}
                                title={t('queryPalette.clickCopy')}
                              />
                              <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 max-w-[72px] truncate">
                                {hex.toUpperCase()}
                              </span>
                              <button
                                onClick={() => {
                                  removeColorFromPalette(p.id, idx);
                                  addToast(t('queryPalette.removed'));
                                }}
                                className="absolute -top-1 -right-1 p-1 bg-white dark:bg-slate-600 rounded-full shadow border border-slate-200 dark:border-slate-500 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/40 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={12} />
                              </button>
                            </motion.div>
                          ))}
                        </div>

                        {/* 添加颜色 */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-600">
                          <input
                            type="text"
                            placeholder={t('queryPalette.inputPlaceholder')}
                            value={addColorInput[p.id] ?? ''}
                            onChange={(e) =>
                              setAddColorInput((prev) => ({
                                ...prev,
                                [p.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddColor(p.id);
                            }}
                            className="px-3 py-2 border border-slate-200 dark:border-slate-500 rounded-lg font-mono text-sm w-36 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                          />
                          <input
                            type="color"
                            className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-500 cursor-pointer"
                            value={p.colors[0] ?? '#6366f1'}
                            onChange={(e) => {
                              addColorToPalette(p.id, e.target.value);
                              addToast(t('queryPalette.added'));
                            }}
                            title={t('queryPalette.pickToAdd')}
                          />
                          <button
                            onClick={() => handleAddColor(p.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-bold text-sm hover:bg-indigo-200 transition-colors"
                          >
                            <Plus size={16} />
                            {t('queryPalette.add')}
                          </button>
                          {lastPickedColor && (
                            <button
                              onClick={() => handleAddColor(p.id, lastPickedColor)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-100 text-rose-700 rounded-lg font-bold text-sm hover:bg-rose-200 transition-colors"
                            >
                              <Heart size={16} />
                              {t('queryPalette.addCurrentPicked')}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 自定义确认弹窗：与应用风格统一，替代 Windows 原生 confirm */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]"
              onClick={() => setConfirmDelete(null)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-delete-title"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-md"
            >
              <div
                className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-600 shadow-xl p-6 mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <p id="confirm-delete-title" className="text-slate-800 dark:text-slate-100 font-bold text-lg mb-6">
                  {t('queryPalette.confirmDelete', { name: confirmDelete.name })}
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(null)}
                    className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirmDelete) {
                        removePalette(confirmDelete.id);
                        addToast(t('queryPalette.deleted'));
                        setConfirmDelete(null);
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
                  >
                    {t('common.confirm')}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default PaletteManager;
