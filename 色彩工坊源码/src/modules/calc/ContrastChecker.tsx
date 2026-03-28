/**
 * 功能：对比度检查子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import labPlugin from 'colord/plugins/lab';
import { Info, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

extend([a11yPlugin, labPlugin]);

const ContrastChecker: React.FC = () => {
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
    if (matchScore > 85) return { label: '完美契合', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 };
    if (matchScore > 70) return { label: '高度匹配', color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle2 };
    if (matchScore > 50) return { label: '基本协调', color: 'text-amber-600', bg: 'bg-amber-50', icon: Sparkles };
    if (matchScore > 30) return { label: '勉强可用', color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertCircle };
    return { label: '建议更换', color: 'text-rose-600', bg: 'bg-rose-50', icon: AlertCircle };
  };

  const match = getMatchLevel();

  return (
    <PageContainer title="颜色匹配度" hideDefaultTitle>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-100 border-2 border-white/50">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">颜色匹配度与对比度检查</h1>
              <p className="text-xs text-slate-500 font-medium">分析颜色的相似性与可读性匹配度</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-6">
          {/* Left Panel: Inputs and Results */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block px-1">背景颜色 (Background)</label>
                  <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 focus-within:border-amber-200 transition-all">
                    <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer shrink-0 border-2 border-white shadow-sm" />
                    <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} className="flex-1 bg-transparent border-none font-mono text-base uppercase font-bold text-slate-700 focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block px-1">前景颜色 (Foreground)</label>
                  <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 focus-within:border-amber-200 transition-all">
                    <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer shrink-0 border-2 border-white shadow-sm" />
                    <input type="text" value={fg} onChange={(e) => setFg(e.target.value)} className="flex-1 bg-transparent border-none font-mono text-base uppercase font-bold text-slate-700 focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Match Result Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`py-4 px-3 rounded-2xl border-2 transition-all ${match.bg} ${match.color} border-current/10 flex flex-col items-center justify-center text-center gap-1`}>
                  <match.icon size={18} className="mb-0.5" />
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">匹配评价</div>
                  <div className="text-base font-black">{match.label}</div>
                </div>
                <div className={`py-4 px-3 rounded-2xl border-2 transition-all ${isAA ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'} flex flex-col items-center justify-center text-center gap-1`}>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">WCAG AA</div>
                  <div className="text-base font-black">{isAA ? '通过' : '未通过'}</div>
                </div>
                <div className={`py-4 px-3 rounded-2xl border-2 transition-all ${isAAA ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'} flex flex-col items-center justify-center text-center gap-1`}>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">WCAG AAA</div>
                  <div className="text-base font-black">{isAAA ? '通过' : '未通过'}</div>
                </div>
              </div>
            </div>

            {/* Visual Preview */}
            <div 
              className="p-8 rounded-3xl shadow-xl border-4 border-white min-h-[260px] flex items-center justify-center text-center transition-all duration-500 relative overflow-hidden"
              style={{ backgroundColor: bg, color: fg }}
            >
              <div className="relative z-10 space-y-3">
                <h4 className="text-4xl font-black tracking-tighter">预览文本效果</h4>
                <p className="text-base font-medium opacity-90 max-w-sm mx-auto leading-relaxed">
                  鲲穹色彩工坊提供专业的颜色匹配与对比度分析，帮助您构建更加和谐、易读的数字化视觉体验。
                </p>
                <div className="pt-4 flex justify-center gap-4">
                  <div className="px-5 py-2 rounded-full border-2 border-current font-bold text-xs">主要按钮</div>
                  <div className="px-5 py-2 rounded-full bg-current font-bold text-xs" style={{ color: bg }}>反转效果</div>
                </div>
              </div>
              {/* Decorative background elements using current color */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-5 rounded-full -mr-12 -mt-12" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-current opacity-5 rounded-full -ml-16 -mb-16" />
            </div>
          </div>

          {/* Right Panel: Stats and Charts */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-8">
              <div className="space-y-2">
                <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">对比度分值</div>
                <div className="text-7xl font-black text-slate-800 tracking-tighter tabular-nums">{contrast.toFixed(2)}</div>
                <div className="w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden mx-auto">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (contrast / 21) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="w-full border-t border-slate-50 pt-8 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">综合匹配度</div>
                  <div className="text-3xl font-black text-slate-700">{matchScore.toFixed(1)}%</div>
                  <p className="text-[10px] text-slate-500 font-medium">综合评价</p>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">颜色相似度</div>
                  <div className="text-3xl font-black text-slate-700">{similarity.toFixed(1)}%</div>
                  <p className="text-[10px] text-slate-500 font-medium">Lab 感知度</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl text-white space-y-3 shadow-xl shadow-indigo-100">
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest opacity-80">
                <Info size={14} />
                <span>匹配度建议</span>
              </div>
              <p className="text-indigo-50 text-[13px] leading-relaxed font-medium">
                {similarity > 70 
                  ? "这两组颜色非常接近，适合作为同色系方案使用，但作为背景和文字时可能导致可读性极低，请注意对比度分值。"
                  : similarity > 30 
                    ? "颜色之间存在明显的区分，如果对比度超过 4.5，这是一个非常平衡的视觉组合。"
                    : "这是一组强对比颜色，视觉冲击力强，非常适合作为强调色或高可读性文本组合。"}
              </p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-indigo-50/50 p-8 rounded-xl border border-indigo-100 space-y-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
            <Info size={20} />
            <h3>关于颜色匹配度介绍:</h3>
          </div>
          <div className="space-y-3 text-indigo-800/80 text-sm leading-relaxed font-medium">
            <p>1、此工具综合了 **WCAG 对比度** 与 **Lab 颜色相似度** 两个维度，全面评估两张颜色的“匹配程度”。</p>
            <p>2、**相似度** 基于 Lab 空间的欧几氏距离计算，能够反映人眼感知的颜色接近程度（100% 为完全相同）。</p>
            <p>3、**对比度** 决定了文字的可读性，AA 级（4.5:1）是 Web 内容的基本要求，AAA 级（7:1）则提供最佳阅读体验。</p>
            <p>4、通过本工具，您可以确保界面设计既满足审美上的**色彩和谐（相似性）**，又满足功能上的**无障碍阅读（对比度）**。</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ContrastChecker;
