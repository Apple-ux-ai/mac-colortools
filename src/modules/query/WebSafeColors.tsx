/**
 * 功能：Web安全色子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/PageContainer';
import { colord } from 'colord';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

const WebSafeColors: React.FC = () => {
  const { t } = useTranslation();
  const addToast = useToastStore((state) => state.addToast);
  const steps = ['00', '33', '66', '99', 'CC', 'FF'];
  const colors: string[] = [];

  steps.forEach(r => {
    steps.forEach(g => {
      steps.forEach(b => {
        colors.push(`#${r}${g}${b}`);
      });
    });
  });

  const handleCopy = async (color: string, format: 'hex' | 'rgb') => {
    const value = format === 'hex' ? color.toUpperCase() : colord(color).toRgbString();
    const success = await copyToClipboard(value);
    if (success) {
      addToast(t('toast.copySuccessPlain', { value: `${format.toUpperCase()}: ${value}` }));
    } else {
      addToast(t('toast.copyFailRetry'), 'error');
    }
  };

  return (
    <PageContainer title={t('queryWebsafe.title')}>
      <div className="bg-white dark:bg-slate-800 p-10 rounded-[40px] border border-slate-100 dark:border-slate-600 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {colors.map(hex => {
            const rgb = colord(hex).toRgb();
            const rgbStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
            
            return (
              <div 
                key={hex}
                className="flex flex-col rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Color Display Area */}
                <div 
                  className="h-24 w-full transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: hex }}
                />
                
                {/* Info and Copy Area */}
                <div className="p-3 bg-slate-50/80 dark:bg-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">HEX</span>
                    <button 
                      onClick={() => handleCopy(hex, 'hex')}
                      className="flex-1 px-2 py-1 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-md font-mono text-[11px] font-black text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-left truncate"
                      title={t('queryWebsafe.clickCopyHex', { value: hex.toUpperCase() })}
                    >
                      {hex.toUpperCase()}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">RGB</span>
                    <button 
                      onClick={() => handleCopy(hex, 'rgb')}
                      className="flex-1 px-2 py-1 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-md font-mono text-[11px] font-black text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-left truncate"
                      title={t('queryWebsafe.clickCopyRgb', { value: rgbStr })}
                    >
                      {rgbStr}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 p-8 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-3xl text-sm text-indigo-900/70 dark:text-indigo-200/90 leading-relaxed border border-indigo-100/50 dark:border-indigo-800/50">
          <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full" />
            {t('queryWebsafe.aboutTitle')}
          </h4>
          <p>{t('queryWebsafe.aboutDesc')}</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default WebSafeColors;
