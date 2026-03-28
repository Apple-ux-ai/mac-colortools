/**
 * 功能：RGB/CMYK 颜色对照表子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/PageContainer';
import { colord } from 'colord';
import { Info, Copy } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

const referenceColors = [
  { name: 'Red', hex: '#FF0000' },
  { name: 'Green', hex: '#00FF00' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Cyan', hex: '#00FFFF' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Brown', hex: '#A52A2A' },
];

const ColorReferenceTable: React.FC = () => {
  const { t } = useTranslation();
  const addToast = useToastStore((state) => state.addToast);
  return (
    <PageContainer title={t('queryReference.title')}>
      <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-600 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/50">
              <th className="px-8 py-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('queryReference.preview')}</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('queryReference.name')}</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">HEX</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">RGB</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('queryReference.cmykApprox')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-600">
            {referenceColors.map((color, idx) => {
              const c = colord(color.hex);
              const rgb = c.toRgb();
              // 简易 CMYK 转换逻辑
              const r = rgb.r / 255;
              const g = rgb.g / 255;
              const b = rgb.b / 255;
              const k = 1 - Math.max(r, g, b);
              const cmyk = k === 1 
                ? { c: 0, m: 0, y: 0, k: 100 }
                : {
                    c: Math.round(((1 - r - k) / (1 - k)) * 100),
                    m: Math.round(((1 - g - k) / (1 - k)) * 100),
                    y: Math.round(((1 - b - k) / (1 - k)) * 100),
                    k: Math.round(k * 100)
                  };

              return (
                <tr key={`${color.hex}-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="w-12 h-12 rounded-xl shadow-inner border-2 border-white dark:border-slate-600" style={{ backgroundColor: color.hex }} />
                  </td>
                  <td className="px-8 py-4 font-bold text-slate-700 dark:text-slate-200">{color.name}</td>
                  <td className="px-8 py-4 font-mono text-sm uppercase text-slate-400 dark:text-slate-400">{color.hex}</td>
                  <td className="px-8 py-4 font-mono text-sm text-slate-400 dark:text-slate-400">
                    <button 
                      onClick={async () => {
                        const rgbStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
                        const success = await copyToClipboard(rgbStr);
                        if (success) {
                          addToast(t('toast.copySuccessPlain', { value: `RGB: ${rgbStr}` }));
                        } else {
                          addToast(t('toast.copyFailRetry'), 'error');
                        }
                      }}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
                    >
                      {rgb.r}, {rgb.g}, {rgb.b}
                      <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </td>
                  <td className="px-8 py-4 font-mono text-sm text-slate-400 dark:text-slate-400">
                    {cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-8 bg-indigo-50/50 dark:bg-indigo-900/20 p-8 rounded-xl border border-indigo-100 dark:border-indigo-800/50 space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-lg">
          <Info size={20} />
          <h3>{t('queryReference.aboutTitle')}</h3>
        </div>
        <div className="space-y-3 text-indigo-800/80 dark:text-indigo-200/90 text-sm leading-relaxed font-medium">
          <p>{t('queryReference.about1')}</p>
          <p>{t('queryReference.about2')}</p>
          <p>{t('queryReference.about3')}</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default ColorReferenceTable;
