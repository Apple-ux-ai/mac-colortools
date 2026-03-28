/**
 * 功能：灰度转换子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/PageContainer';
import { colord } from 'colord';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

const GrayscaleConverter: React.FC = () => {
  const { t } = useTranslation();
  const addToast = useToastStore((state) => state.addToast);
  const [color, setColor] = useState('#6366f1');
  const grayscale = colord(color).grayscale().toHex();

  return (
    <PageContainer title={t('calcGrayscale.title')}>
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 w-full space-y-4">
            <h3 className="font-bold text-slate-400 dark:text-slate-500 text-center uppercase tracking-widest text-sm">{t('calcGrayscale.originalColor')}</h3>
            <div className="w-full h-64 rounded-[40px] shadow-xl border-4 border-white dark:border-slate-600" style={{ backgroundColor: color }} />
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer" />
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-500 rounded-xl px-4 py-2 font-mono text-center uppercase text-slate-800 dark:text-slate-200" />
          </div>

          <div className="text-4xl text-slate-200 dark:text-slate-500">→</div>

          <div className="flex-1 w-full space-y-4">
            <h3 className="font-bold text-slate-400 dark:text-slate-500 text-center uppercase tracking-widest text-sm">{t('calcGrayscale.grayscaleResult')}</h3>
            <div className="w-full h-64 rounded-[40px] shadow-xl border-4 border-white dark:border-slate-600 transition-all duration-500" style={{ backgroundColor: grayscale }} />
            <div className="h-12 flex items-center justify-center font-black text-2xl text-slate-800 dark:text-slate-200 uppercase font-mono">{grayscale}</div>
            <button 
              onClick={async () => {
                const success = await copyToClipboard(grayscale);
                if (success) {
                  addToast(t('toast.copySuccessGrayscale', { value: grayscale.toUpperCase() }));
                } else {
                  addToast(t('toast.copyFailRetry'), 'error');
                }
              }}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              {t('calcGrayscale.copyGrayscale')}
            </button>
          </div>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-800/50">
          <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-2">💡 {t('calcGrayscale.whatIsTitle')}</h4>
          <p className="text-indigo-700/80 dark:text-indigo-200/90 text-sm leading-relaxed">
            {t('calcGrayscale.whatIsDesc')}
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default GrayscaleConverter;
