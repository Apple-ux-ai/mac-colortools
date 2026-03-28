/**
 * 功能：相反颜色计算子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { colord } from 'colord';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

const OppositeColor: React.FC = () => {
  const addToast = useToastStore((state) => state.addToast);
  const [color, setColor] = useState('#6366f1');
  
  // 计算相反色（补色）
  const opposite = colord(color).rotate(180).toHex();

  return (
    <PageContainer title="相反颜色计算">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
          <div className="flex-1 w-full space-y-4 text-center">
            <h3 className="font-black text-slate-400 uppercase tracking-widest text-xs">原始颜色</h3>
            <div 
              className="w-full aspect-square rounded-[40px] shadow-2xl border-8 border-white transition-all duration-500"
              style={{ backgroundColor: color }}
            />
            <div className="flex flex-col gap-2">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer" />
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 font-mono text-center uppercase font-bold text-slate-700" />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-slate-300 font-bold text-2xl">⇄</span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-4 text-center">
            <h3 className="font-black text-slate-400 uppercase tracking-widest text-xs">相反颜色 (补色)</h3>
            <div 
              className="w-full aspect-square rounded-[40px] shadow-2xl border-8 border-white transition-all duration-500"
              style={{ backgroundColor: opposite }}
            />
            <div className="flex flex-col gap-2">
              <div className="h-12 flex items-center justify-center font-mono text-2xl font-black text-indigo-600 uppercase">{opposite}</div>
              <button 
                onClick={async () => {
                  const success = await copyToClipboard(opposite);
                  if (success) {
                    addToast(`已成功复制相反色: ${opposite.toUpperCase()}`);
                  } else {
                    addToast('复制失败', 'error');
                  }
                }}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                复制相反色
              </button>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100">
          <h4 className="font-bold text-amber-900 mb-2">💡 什么是相反色？</h4>
          <p className="text-amber-700/80 text-sm leading-relaxed">
            在色相环上与当前颜色位置完全相对（相差 180 度）的颜色被称为补色或相反色。补色在一起使用时会产生强烈的视觉对比效果，常用于需要极高辨识度的 UI 元素（如警示、强调等）。
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default OppositeColor;
