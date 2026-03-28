/**
 * 功能：相反颜色计算子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/PageContainer';
import { colord } from 'colord';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

const OppositeColor: React.FC = () => {
  const { t } = useTranslation();
  const addToast = useToastStore((state) => state.addToast);
  const [color, setColor] = useState('#6366f1');
  const opposite = colord(color).rotate(180).toHex();

  return (
    <PageContainer title={t('calcOpposite.title')}>
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
          <div className="flex-1 w-full space-y-4 text-center">
            <h3 className="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-xs">{t('calcOpposite.originalColor')}</h3>
            <div 
              className="w-full aspect-square rounded-[40px] shadow-2xl border-8 border-white dark:border-slate-600 transition-all duration-500"
              style={{ backgroundColor: color }}
            />
            <div className="flex flex-col gap-2">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer" />
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-500 rounded-xl px-4 py-2 font-mono text-center uppercase font-bold text-slate-700 dark:text-slate-200" />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-600 flex items-center justify-center">
              <span className="text-slate-300 dark:text-slate-400 font-bold text-2xl">⇄</span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-4 text-center">
            <h3 className="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-xs">{t('calcOpposite.oppositeColor')}</h3>
            <div 
              className="w-full aspect-square rounded-[40px] shadow-2xl border-8 border-white dark:border-slate-600 transition-all duration-500"
              style={{ backgroundColor: opposite }}
            />
            <div className="flex flex-col gap-2">
              <div className="h-12 flex items-center justify-center font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase">{opposite}</div>
              <button 
                onClick={async () => {
                  const success = await copyToClipboard(opposite);
                  if (success) {
                    addToast(t('toast.copySuccessOpposite', { value: opposite.toUpperCase() }));
                  } else {
                    addToast(t('toast.copyFailRetry'), 'error');
                  }
                }}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
              >
                {t('calcOpposite.copyOpposite')}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-8 rounded-3xl border border-amber-100 dark:border-amber-800/50">
          <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-2">💡 {t('calcOpposite.whatIsTitle')}</h4>
          <p className="text-amber-700/80 dark:text-amber-200/90 text-sm leading-relaxed">
            {t('calcOpposite.whatIsDesc')}
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default OppositeColor;
