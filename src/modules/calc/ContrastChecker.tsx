/**
 * 功能：对比度检查子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/PageContainer';
import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import labPlugin from 'colord/plugins/lab';
import { Info, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

extend([a11yPlugin, labPlugin]);

const ContrastChecker: React.FC = () => {
  const { t } = useTranslation();
  const [bg, setBg] = useState('#ffffff');
  const [fg, setFg] = useState('#6366f1');

  const contrast = colord(bg).contrast(fg);
  const isAA = contrast >= 4.5;
  const isAAA = contrast >= 7;

  // 计算相似度 (基于 Lab 空间的欧几里得距离)
  const lab1 = colord(bg).toLab();
  const lab2 = colord(fg).toLab();
  const distance = Math.sqrt(
    Math.pow(lab1.l - lab2.l, 2) + 
    Math.pow(lab1.a - lab2.a, 2) + 
    Math.pow(lab1.b - lab2.b, 2)
  );
  // 相似度算法：100 - (距离 / 最大可能距离 * 100)
  // Lab 空间最大距离约为 150-200，这里取 160 作为基准
  const similarity = Math.max(0, Math.min(100, 100 - (distance / 160) * 100));

  // 综合匹配度计算 (0-100)
  // 逻辑：对比度占 60%，相似度占 40%
  // 对比度满分 21，相似度满分 100
  const matchScore = Math.min(100, (contrast / 21) * 60 + (similarity / 100) * 40);

  // 匹配度评价
  const getMatchLevel = () => {
    if (matchScore > 85) return { labelKey: 'calcContrast.perfect', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/40', icon: CheckCircle2 };
    if (matchScore > 70) return { labelKey: 'calcContrast.highMatch', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/40', icon: CheckCircle2 };
    if (matchScore > 50) return { labelKey: 'calcContrast.basicMatch', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/40', icon: Sparkles };
    if (matchScore > 30) return { labelKey: 'calcContrast.lowMatch', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/40', icon: AlertCircle };
    return { labelKey: 'calcContrast.suggestChange', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/40', icon: AlertCircle };
  };

  const match = getMatchLevel();

  return (
    <PageContainer title={t('calcContrast.title')} hideDefaultTitle>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-100 dark:shadow-amber-900/30 border-2 border-white/50 dark:border-slate-600/50">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{t('calcContrast.pageTitle')}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('calcContrast.subtitle')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-6">
          {/* Left Panel: Inputs and Results */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-600 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1">{t('calcContrast.background')}</label>
                  <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-700/60 rounded-xl border border-slate-100 dark:border-slate-600 focus-within:border-amber-200 dark:focus-within:border-amber-500 transition-all">
                    <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer shrink-0 border-2 border-white dark:border-slate-500 shadow-sm" />
                    <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} className="flex-1 bg-transparent border-none font-mono text-base uppercase font-bold text-slate-700 dark:text-slate-200 focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1">{t('calcContrast.foreground')}</label>
                  <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-700/60 rounded-xl border border-slate-100 dark:border-slate-600 focus-within:border-amber-200 dark:focus-within:border-amber-500 transition-all">
                    <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer shrink-0 border-2 border-white dark:border-slate-500 shadow-sm" />
                    <input type="text" value={fg} onChange={(e) => setFg(e.target.value)} className="flex-1 bg-transparent border-none font-mono text-base uppercase font-bold text-slate-700 dark:text-slate-200 focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Match Result Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`py-4 px-3 rounded-2xl border-2 transition-all ${match.bg} ${match.color} border-current/10 dark:border-current/20 flex flex-col items-center justify-center text-center gap-1`}>
                  <match.icon size={18} className="mb-0.5" />
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">{t('calcContrast.matchRating')}</div>
                  <div className="text-base font-black">{t(match.labelKey)}</div>
                </div>
                <div className={`py-4 px-3 rounded-2xl border-2 transition-all ${isAA ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-700' : 'bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-700'} flex flex-col items-center justify-center text-center gap-1`}>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">{t('calcContrast.wcagAA')}</div>
                  <div className="text-base font-black">{isAA ? t('calcContrast.pass') : t('calcContrast.fail')}</div>
                </div>
                <div className={`py-4 px-3 rounded-2xl border-2 transition-all ${isAAA ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-700' : 'bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-700'} flex flex-col items-center justify-center text-center gap-1`}>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">{t('calcContrast.wcagAAA')}</div>
                  <div className="text-base font-black">{isAAA ? t('calcContrast.pass') : t('calcContrast.fail')}</div>
                </div>
              </div>
            </div>

            {/* Visual Preview */}
            <div 
              className="p-8 rounded-3xl shadow-xl border-4 border-white dark:border-slate-600 min-h-[260px] flex items-center justify-center text-center transition-all duration-500 relative overflow-hidden"
              style={{ backgroundColor: bg, color: fg }}
            >
              <div className="relative z-10 space-y-3">
                <h4 className="text-4xl font-black tracking-tighter">{t('calcContrast.previewText')}</h4>
                <p className="text-base font-medium opacity-90 max-w-sm mx-auto leading-relaxed">
                  {t('calcContrast.previewDesc')}
                </p>
                <div className="pt-4 flex justify-center gap-4">
                  <div className="px-5 py-2 rounded-full border-2 border-current font-bold text-xs">{t('calcContrast.primaryBtn')}</div>
                  <div className="px-5 py-2 rounded-full bg-current font-bold text-xs" style={{ color: bg }}>{t('calcContrast.invertBtn')}</div>
                </div>
              </div>
              {/* Decorative background elements using current color */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-5 rounded-full -mr-12 -mt-12" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-current opacity-5 rounded-full -ml-16 -mb-16" />
            </div>
          </div>

          {/* Right Panel: Stats and Charts */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-600 shadow-sm flex flex-col items-center justify-center text-center space-y-8">
              <div className="space-y-2">
                <div className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{t('calcContrast.contrastScore')}</div>
                <div className="text-7xl font-black text-slate-800 dark:text-slate-100 tracking-tighter tabular-nums">{contrast.toFixed(2)}</div>
                <div className="w-40 h-1.5 bg-slate-100 dark:bg-slate-600 rounded-full overflow-hidden mx-auto">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (contrast / 21) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="w-full border-t border-slate-50 dark:border-slate-600 pt-8 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{t('calcContrast.matchScore')}</div>
                  <div className="text-3xl font-black text-slate-700 dark:text-slate-200">{matchScore.toFixed(1)}%</div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{t('calcContrast.comprehensiveEval')}</p>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{t('calcContrast.colorSimilarity')}</div>
                  <div className="text-3xl font-black text-slate-700 dark:text-slate-200">{similarity.toFixed(1)}%</div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{t('calcContrast.labPerception')}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl text-white space-y-3 shadow-xl shadow-indigo-100 dark:shadow-indigo-900/30">
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest opacity-80">
                <Info size={14} />
                <span>{t('calcContrast.matchSuggestion')}</span>
              </div>
              <p className="text-indigo-50 text-[13px] leading-relaxed font-medium">
                {similarity > 70 ? t('calcContrast.matchHint1') : similarity > 30 ? t('calcContrast.matchHint2') : t('calcContrast.matchHint3')}
              </p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-8 rounded-xl border border-indigo-100 dark:border-indigo-800/50 space-y-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-lg">
            <Info size={20} />
            <h3>{t('calcContrast.aboutTitle')}</h3>
          </div>
          <div className="space-y-3 text-indigo-800/80 dark:text-indigo-200/90 text-sm leading-relaxed font-medium">
            <p>{t('calcContrast.about1')}</p>
            <p>{t('calcContrast.about2')}</p>
            <p>{t('calcContrast.about3')}</p>
            <p>{t('calcContrast.about4')}</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ContrastChecker;
