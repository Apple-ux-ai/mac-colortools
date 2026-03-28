/**
 * 功能：颜色混合子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/PageContainer';
import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import { Plus, Equal, Copy, Info, RefreshCw } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

extend([mixPlugin]);

const ColorMixer: React.FC = () => {
  const { t } = useTranslation();
  const addToast = useToastStore((state) => state.addToast);
  const [color1, setColor1] = useState('#6366f1');
  const [color2, setColor2] = useState('#f43f5e');
  const [ratio, setRatio] = useState(0.5);

  const mixed = colord(color1).mix(color2, ratio);
  const mixedColor = mixed.toHex();
  const mixedRgb = mixed.toRgbString();

  return (
    <PageContainer title={t('calcMix.title')} hideDefaultTitle>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30 border-2 border-white/50 dark:border-slate-600/50">
              <RefreshCw size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{t('calcMix.pageTitle')}</h1>
          </div>
        </div>

        {/* Main Mixing Area */}
        <div className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-[40px] border border-slate-100 dark:border-slate-600 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr,auto,1fr,auto,1.2fr] gap-6 md:gap-8 items-center">
            {/* Color 1 */}
            <div className="space-y-4 max-w-sm mx-auto w-full group">
              <div 
                className="w-full h-32 md:h-40 xl:h-48 rounded-3xl shadow-inner border-4 border-white dark:border-slate-600 transition-all duration-500 cursor-pointer relative overflow-hidden" 
                style={{ backgroundColor: color1 }}
                onClick={() => document.getElementById('color1-picker')?.click()}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <RefreshCw className="text-white/0 group-hover:text-white/50 transition-colors" size={24} />
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-700/60 rounded-2xl border border-slate-100 dark:border-slate-600 focus-within:border-indigo-200 dark:focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50/50 dark:focus-within:ring-indigo-900/30 transition-all">
                  <div 
                    className="w-6 h-6 rounded-lg border border-slate-200 dark:border-slate-500 cursor-pointer shrink-0" 
                    style={{ backgroundColor: color1 }}
                    onClick={() => document.getElementById('color1-picker')?.click()}
                  />
                  <input 
                    type="text" 
                    value={color1} 
                    onChange={(e) => setColor1(e.target.value)}
                    className="flex-1 bg-transparent border-none font-mono text-sm uppercase font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <input 
                  id="color1-picker"
                  type="color" 
                  value={color1} 
                  onChange={(e) => setColor1(e.target.value)}
                  className="absolute opacity-0 pointer-events-none"
                />
              </div>
            </div>

            {/* Plus Icon */}
            <div className="hidden xl:flex items-center justify-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-full text-slate-300 dark:text-slate-500 border border-slate-100 dark:border-slate-600">
                <Plus size={20} />
              </div>
            </div>

            {/* Color 2 */}
            <div className="space-y-4 max-w-sm mx-auto w-full group">
              <div 
                className="w-full h-32 md:h-40 xl:h-48 rounded-3xl shadow-inner border-4 border-white dark:border-slate-600 transition-all duration-500 cursor-pointer relative overflow-hidden" 
                style={{ backgroundColor: color2 }}
                onClick={() => document.getElementById('color2-picker')?.click()}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <RefreshCw className="text-white/0 group-hover:text-white/50 transition-colors" size={24} />
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-700/60 rounded-2xl border border-slate-100 dark:border-slate-600 focus-within:border-indigo-200 dark:focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50/50 dark:focus-within:ring-indigo-900/30 transition-all">
                  <div 
                    className="w-6 h-6 rounded-lg border border-slate-200 dark:border-slate-500 cursor-pointer shrink-0" 
                    style={{ backgroundColor: color2 }}
                    onClick={() => document.getElementById('color2-picker')?.click()}
                  />
                  <input 
                    type="text" 
                    value={color2} 
                    onChange={(e) => setColor2(e.target.value)}
                    className="flex-1 bg-transparent border-none font-mono text-sm uppercase font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <input 
                  id="color2-picker"
                  type="color" 
                  value={color2} 
                  onChange={(e) => setColor2(e.target.value)}
                  className="absolute opacity-0 pointer-events-none"
                />
              </div>
            </div>

            {/* Equal Icon & Ratio Slider */}
            <div className="flex xl:flex-col items-center justify-center gap-6 py-4 col-span-full xl:col-span-1">
              <div className="hidden xl:block p-3 bg-slate-50 dark:bg-slate-700 rounded-full text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-600">
                <Equal size={20} />
              </div>
              <div className="w-full max-w-md flex flex-col items-center gap-4">
                <div className="w-full flex justify-between text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">
                  <span>{t('calcMix.color1')}</span>
                  <span>{t('calcMix.ratio')}</span>
                  <span>{t('calcMix.color2')}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={ratio}
                  onChange={(e) => setRatio(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
                  {Math.round((1 - ratio) * 100)}% : {Math.round(ratio * 100)}%
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="col-span-full xl:col-span-1 xl:pl-8 xl:border-l xl:border-slate-100 dark:xl:border-slate-600 space-y-6">
              <div className="flex xl:flex-col items-center gap-6 xl:gap-2">
                <div className="flex-1 xl:w-full text-center space-y-2">
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] block">{t('calcMix.mixedResult')}</span>
                  <div 
                    className="w-full h-32 md:h-40 xl:h-48 rounded-3xl shadow-2xl border-4 md:border-8 border-white dark:border-slate-600 transition-all duration-500 relative group overflow-hidden"
                    style={{ backgroundColor: mixedColor }}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <button 
                        onClick={async () => {
                          const success = await copyToClipboard(mixedColor);
                          if (success) {
                            addToast(t('toast.copySuccessMixed', { value: mixedColor.toUpperCase() }));
                          } else {
                            addToast(t('toast.copyFailRetry'), 'error');
                          }
                        }}
                        className="p-3 bg-white/90 dark:bg-slate-700/90 backdrop-blur shadow-xl rounded-xl scale-0 group-hover:scale-100 transition-all hover:bg-white dark:hover:bg-slate-600 active:scale-90"
                      >
                        <Copy size={20} className="text-indigo-600 dark:text-indigo-400" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 xl:w-full space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-700/60 p-3 rounded-xl border border-slate-100 dark:border-slate-600 group hover:border-indigo-100 dark:hover:border-indigo-700 transition-all">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">HEX</span>
                      <button 
                        onClick={async () => {
                          const success = await copyToClipboard(mixedColor.toUpperCase());
                          if (success) {
                            addToast(t('toast.copySuccessHex', { value: mixedColor.toUpperCase() }));
                          } else {
                            addToast(t('toast.copyFailRetry'), 'error');
                          }
                        }} 
                        className="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300"
                      >
                        <Copy size={10} />
                      </button>
                    </div>
                    <div className="font-mono text-sm md:text-base font-black text-slate-800 dark:text-slate-200 uppercase">{mixedColor}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/60 p-3 rounded-xl border border-slate-100 dark:border-slate-600 group hover:border-indigo-100 dark:hover:border-indigo-700 transition-all">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">RGB</span>
                      <button 
                        onClick={async () => {
                          const success = await copyToClipboard(mixedRgb);
                          if (success) {
                            addToast(t('toast.copySuccessRgb', { value: mixedRgb }));
                          } else {
                            addToast(t('toast.copyFailRetry'), 'error');
                          }
                        }} 
                        className="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300"
                      >
                        <Copy size={10} />
                      </button>
                    </div>
                    <div className="font-mono text-sm font-bold text-slate-600 dark:text-slate-300 truncate">{mixedRgb}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-orange-50/50 dark:bg-orange-900/20 p-8 rounded-xl border border-orange-100 dark:border-orange-800/50 space-y-4">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-lg">
            <Info size={20} />
            <h3>{t('calcMix.aboutTitle')}</h3>
          </div>
          <div className="space-y-3 text-orange-800/80 dark:text-orange-200/90 text-sm leading-relaxed font-medium">
            <p>{t('calcMix.about1')}</p>
            <p>{t('calcMix.about2')}</p>
            <p>{t('calcMix.about3')}</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ColorMixer;
