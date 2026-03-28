/**
 * 功能：中间色生成子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import { Info } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

extend([mixPlugin]);

const IntermediateColors: React.FC = () => {
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
    <PageContainer title="中间色计算" hideDefaultTitle>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-100 border-2 border-white/50">
              <Info size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">中间色计算生成器</h1>
          </div>
        </div>

        <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">起始颜色</label>
            <div className="flex gap-4">
              <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-16 h-16 rounded-2xl cursor-pointer" />
              <input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="flex-1 bg-slate-50 border-none rounded-2xl px-4 font-mono text-lg uppercase" />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">终止颜色</label>
            <div className="flex gap-4">
              <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-16 h-16 rounded-2xl cursor-pointer" />
              <input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="flex-1 bg-slate-50 border-none rounded-2xl px-4 font-mono text-lg uppercase" />
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">中间色数量: {steps}</label>
              <input type="range" min="1" max="15" value={steps} onChange={(e) => setSteps(parseInt(e.target.value))} className="w-48" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-center font-bold text-slate-400 uppercase tracking-widest text-sm">生成的渐变色阶</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {colors.map((hex, i) => (
              <div key={i} className="flex flex-col items-center gap-3 group relative">
                <div 
                  className="w-16 h-24 rounded-2xl shadow-sm border border-white/50 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: hex }}
                  onClick={async () => {
                    const success = await copyToClipboard(hex);
                    if (success) {
                      addToast(`已复制颜色: ${hex.toUpperCase()}`);
                    } else {
                      addToast('复制失败', 'error');
                    }
                  }}
                />
                <span className="font-mono text-xs font-bold text-slate-500 uppercase">{hex}</span>
                <div className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">复制</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mt-12 bg-indigo-50/50 p-8 rounded-xl border border-indigo-100 space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
          <Info size={20} />
          <h3>关于中间色计算介绍:</h3>
        </div>
        <div className="space-y-3 text-indigo-800/80 text-sm leading-relaxed font-medium">
          <p>1、此工具可以在指定的起始颜色和终止颜色之间，自动计算并生成平滑过渡的中间色阶。</p>
          <p>2、您可以自由调节生成的中间色数量（1-15个），适用于创建配色方案、UI 渐变过渡或设计系统的色板。</p>
          <p>3、生成的每一个色块均可点击复制 HEX 色值，让您的色彩过渡设计更加精准且具有一致性。</p>
        </div>
      </div>
    </div>
  </PageContainer>
  );
};

export default IntermediateColors;
