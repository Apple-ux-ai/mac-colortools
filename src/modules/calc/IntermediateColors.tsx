/**
 * 功能：中间色生成子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/PageContainer';
import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import { Info } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

extend([mixPlugin]);

const IntermediateColors: React.FC = () => {
  const { t } = useTranslation();
  const addToast = useToastStore((state) => state.addToast);
  const [color1, setColor1] = useState('#6366f1');
  const [color2, setColor2] = useState('#f43f5e');
  const [steps, setSteps] = useState(5);

  const getIntermediateColors = () => {
    const palette = [];
    for (let i = 0; i <= steps + 1; i++) {
      const ratio = i / (steps + 1);
      palette.push(colord(color1).mix(color2, ratio).toHex());
    }
    return palette;
  };

  const colors = getIntermediateColors();

  return (
    <PageContainer title={t('calcIntermediate.title')} hideDefaultTitle>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/30 border-2 border-white/50 dark:border-slate-600/50">
              <Info size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{t('calcIntermediate.pageTitle')}</h1>
          </div>
        </div>

        <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-600 shadow-sm">
          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{t('calcIntermediate.startColor')}</label>
            <div className="flex gap-4">
              <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-16 h-16 rounded-2xl cursor-pointer" />
              <input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="flex-1 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl px-4 font-mono text-lg uppercase text-slate-800 dark:text-slate-200" />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{t('calcIntermediate.endColor')}</label>
            <div className="flex gap-4">
              <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-16 h-16 rounded-2xl cursor-pointer" />
              <input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="flex-1 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl px-4 font-mono text-lg uppercase text-slate-800 dark:text-slate-200" />
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{t('calcIntermediate.stepCount', { count: steps })}</label>
              <input type="range" min="1" max="15" value={steps} onChange={(e) => setSteps(parseInt(e.target.value))} className="w-48 accent-indigo-600" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-center font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-sm">{t('calcIntermediate.gradientTitle')}</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {colors.map((hex, i) => (
              <div key={i} className="flex flex-col items-center gap-3 group relative">
                <div 
                  className="w-16 h-24 rounded-2xl shadow-sm border border-white/50 dark:border-slate-500/50 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: hex }}
                  onClick={async () => {
                    const success = await copyToClipboard(hex);
                    if (success) {
                      addToast(t('toast.copySuccessColor', { value: hex.toUpperCase() }));
                    } else {
                      addToast(t('toast.copyFailRetry'), 'error');
                    }
                  }}
                />
                <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{hex}</span>
                <div className="absolute -top-8 bg-slate-800 dark:bg-slate-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{t('common.copy')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mt-12 bg-indigo-50/50 dark:bg-indigo-900/20 p-8 rounded-xl border border-indigo-100 dark:border-indigo-800/50 space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-lg">
          <Info size={20} />
          <h3>{t('calcIntermediate.aboutTitle')}</h3>
        </div>
        <div className="space-y-3 text-indigo-800/80 dark:text-indigo-200/90 text-sm leading-relaxed font-medium">
          <p>{t('calcIntermediate.about1')}</p>
          <p>{t('calcIntermediate.about2')}</p>
          <p>{t('calcIntermediate.about3')}</p>
        </div>
      </div>
    </div>
  </PageContainer>
  );
};

export default IntermediateColors;
