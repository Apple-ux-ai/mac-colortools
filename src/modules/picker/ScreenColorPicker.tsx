/**
 * 功能：屏幕拾色子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/PageContainer';
import { Monitor, Copy } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

const ScreenColorPicker: React.FC = () => {
  const { t } = useTranslation();
  const addToast = useToastStore((state) => state.addToast);
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePickColor = async () => {
    if (!window.EyeDropper) {
      setError(t('pickerScreen.eyeDropperNotSupported'));
      return;
    }

    const eyeDropper = new window.EyeDropper();
    try {
      const result = await eyeDropper.open();
      setPickedColor(result.sRGBHex);
      setError(null);
    } catch (e) {
      console.log('User canceled or error:', e);
    }
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      addToast(t('toast.copySuccessPlain', { value: text }));
    } else {
      addToast(t('toast.copyFailRetry'), 'error');
    }
  };

  return (
    <PageContainer title={t('pickerScreen.title')} hideDefaultTitle>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30 border-2 border-white/50">
              <Monitor size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{t('pickerScreen.title')}</h1>
          </div>
        </div>

        <div className="text-center space-y-12">
        <div className="bg-white dark:bg-slate-800 p-12 rounded-[40px] border border-slate-100 dark:border-slate-600 shadow-sm space-y-8">
          <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/50 rounded-3xl flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
            <Monitor size={48} />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('pickerScreen.screenPickTitle')}</h3>
            <p className="text-slate-500 dark:text-slate-400">{t('pickerScreen.screenPickDesc')}</p>
          </div>

          <button 
            onClick={handlePickColor}
            className="w-full py-6 bg-indigo-600 text-white rounded-[24px] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-indigo-900/30 flex items-center justify-center gap-3"
          >
            <Monitor size={24} />
            {t('pickerScreen.startPick')}
          </button>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-2xl text-sm border border-red-100 dark:border-red-800/50">
              {error}
            </div>
          )}
        </div>

        {pickedColor && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-600 shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-6">
              <div 
                className="w-20 h-20 rounded-2xl shadow-inner border-4 border-white dark:border-slate-700"
                style={{ backgroundColor: pickedColor }}
              />
              <div className="text-left">
                <span className="block text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-1">
                  {t('pickerScreen.recent')}
                </span>
                <span className="font-mono text-3xl font-black text-slate-800 dark:text-slate-100 uppercase">{pickedColor}</span>
              </div>
            </div>
            <button 
              onClick={() => {
                if (pickedColor) {
                  handleCopy(pickedColor);
                }
              }}
              className="p-4 bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-300 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all"
            >
              <Copy size={24} />
            </button>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-slate-800/60 p-8 rounded-3xl border border-blue-100 dark:border-slate-600 text-sm text-blue-700 dark:text-slate-300 leading-relaxed text-left">
          <h4 className="font-bold mb-2">{t('pickerScreen.tipsTitle')}</h4>
          <p>{t('pickerScreen.tipsDesc')}</p>
        </div>
      </div>
    </div>
  </PageContainer>
  );
};

// 扩展 Window 接口以支持 EyeDropper
declare global {
  interface Window {
    EyeDropper: any;
  }
}

export default ScreenColorPicker;
