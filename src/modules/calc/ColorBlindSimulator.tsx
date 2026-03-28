/**
 * 功能：色盲模拟器 - 单色与图片模拟（红色盲 / 绿色盲 / 蓝黄色盲）
 * 作者：FullStack-Guardian
 * 更新时间：2026-03-03
 */
import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/PageContainer';
import { colord } from 'colord';
import { motion } from 'framer-motion';
import { ImageIcon, Palette, Info } from 'lucide-react';
import {
  simulateColorBlindness,
  simulateImageData,
  type ColorBlindType,
} from '../../utils/colorBlindUtils';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

const COLORBLIND_IDS: ColorBlindType[] = ['protanopia', 'deuteranopia', 'tritanopia'];

const ColorBlindSimulator: React.FC = () => {
  const { t } = useTranslation();
  const addToast = useToastStore((s) => s.addToast);
  const [mode, setMode] = useState<'color' | 'image'>('color');
  const [color, setColor] = useState('#6366f1');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [simulatedImages, setSimulatedImages] = useState<Record<ColorBlindType, string | null>>({
    protanopia: null,
    deuteranopia: null,
    tritanopia: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const c = colord(color);
  const normalHex = c.isValid() ? c.toHex() : '#6366f1';
  const simulatedHex: Record<ColorBlindType, string> = {
    protanopia: simulateColorBlindness(normalHex, 'protanopia'),
    deuteranopia: simulateColorBlindness(normalHex, 'deuteranopia'),
    tritanopia: simulateColorBlindness(normalHex, 'tritanopia'),
  };

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setSimulatedImages({ protanopia: null, deuteranopia: null, tritanopia: null });
    e.target.value = '';
  }, []);

  React.useEffect(() => {
    if (!imageUrl) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const next: Record<ColorBlindType, string | null> = {
        protanopia: null,
        deuteranopia: null,
        tritanopia: null,
      };
      (['protanopia', 'deuteranopia', 'tritanopia'] as ColorBlindType[]).forEach((type) => {
        const out = new Uint8ClampedArray(imageData.data.length);
        simulateImageData(imageData.data, type, out);
        const c2 = document.createElement('canvas');
        c2.width = canvas.width;
        c2.height = canvas.height;
        const ctx2 = c2.getContext('2d');
        if (!ctx2) return;
        const newData = ctx2.createImageData(canvas.width, canvas.height);
        newData.data.set(out);
        ctx2.putImageData(newData, 0, 0);
        next[type] = c2.toDataURL('image/png');
      });
      setSimulatedImages(next);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const handleCopy = async (hex: string) => {
    const ok = await copyToClipboard(hex.toUpperCase());
    if (ok) addToast(t('toast.copySuccessPlain', { value: hex.toUpperCase() }));
    else addToast(t('toast.copyFailRetry'), 'error');
  };

  return (
    <PageContainer title={t('calcColorblind.title')} showBack>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 模式切换 */}
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setMode('color')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              mode === 'color' ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Palette size={18} />
            {t('calcColorblind.singleColor')}
          </button>
          <button
            type="button"
            onClick={() => setMode('image')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              mode === 'image' ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <ImageIcon size={18} />
            {t('calcColorblind.imageMode')}
          </button>
        </div>

        {mode === 'color' && (
          <>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-600 shadow-sm">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-3">
                {t('calcColorblind.chooseColor')}
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="color"
                  value={normalHex}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-500 cursor-pointer"
                />
                <input
                  type="text"
                  value={normalHex}
                  onChange={(e) => setColor(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-500 font-mono text-sm uppercase w-28 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                layout
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-600 shadow-sm"
              >
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{t('calcColorblind.normalVision')}</p>
                <div
                  className="w-full aspect-square max-w-[160px] rounded-xl border border-slate-200 dark:border-slate-500 shadow-inner mb-2"
                  style={{ backgroundColor: normalHex }}
                />
                <button
                  type="button"
                  onClick={() => handleCopy(normalHex)}
                  className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 truncate block w-full text-left"
                >
                  {normalHex.toUpperCase()}
                </button>
              </motion.div>
              {COLORBLIND_IDS.map((id) => (
                <motion.div
                  key={id}
                  layout
                  className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-600 shadow-sm"
                >
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{t(`calcColorblind.${id}`)}</p>
                  <div
                    className="w-full aspect-square max-w-[160px] rounded-xl border border-slate-200 dark:border-slate-500 shadow-inner mb-2"
                    style={{ backgroundColor: simulatedHex[id] }}
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(simulatedHex[id])}
                    className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 truncate block w-full text-left"
                  >
                    {simulatedHex[id].toUpperCase()}
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {mode === 'image' && (
          <>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-600 shadow-sm">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-slate-200 dark:border-slate-500 rounded-2xl text-slate-500 dark:text-slate-400 font-bold hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-2"
              >
                <ImageIcon size={24} />
                {t('calcColorblind.selectImage')}
              </button>
            </div>

            {imageUrl && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-600 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{t('calcColorblind.normalVision')}</p>
                  <img
                    ref={imgRef}
                    src={imageUrl}
                    alt={t('calcColorblind.normalVision')}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-500 object-contain max-h-64 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                {COLORBLIND_IDS.map((id) => (
                  <div key={id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-600 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{t(`calcColorblind.${id}`)}</p>
                    {simulatedImages[id] ? (
                      <img
                        src={simulatedImages[id]!}
                        alt={t(`calcColorblind.${id}`)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-500 object-contain max-h-64 bg-slate-50 dark:bg-slate-900"
                      />
                    ) : (
                      <div className="w-full aspect-video rounded-xl border border-slate-200 dark:border-slate-500 bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
                        {t('calcColorblind.processing')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-600">
          <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
<div className="text-sm text-slate-600 dark:text-slate-400">
          <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">{t('calcColorblind.aboutTitle')}</p>
            <p>
              {t('calcColorblind.aboutDesc')}
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ColorBlindSimulator;
