/**
 * 功能：灰度转换子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { colord } from 'colord';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

const GrayscaleConverter: React.FC = () => {
  const addToast = useToastStore((state) => state.addToast);
  const [color, setColor] = useState('#6366f1');
  const grayscale = colord(color).grayscale().toHex();

  return (
    <PageContainer title="黑白灰度转换">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 w-full space-y-4">
            <h3 className="font-bold text-slate-400 text-center uppercase tracking-widest text-sm">彩色原色</h3>
            <div className="w-full h-64 rounded-[40px] shadow-xl border-4 border-white" style={{ backgroundColor: color }} />
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer" />
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 font-mono text-center uppercase" />
          </div>

          <div className="text-4xl text-slate-200">→</div>

          <div className="flex-1 w-full space-y-4">
            <h3 className="font-bold text-slate-400 text-center uppercase tracking-widest text-sm">灰度结果</h3>
            <div className="w-full h-64 rounded-[40px] shadow-xl border-4 border-white transition-all duration-500" style={{ backgroundColor: grayscale }} />
            <div className="h-12 flex items-center justify-center font-black text-2xl text-slate-800 uppercase font-mono">{grayscale}</div>
            <button 
              onClick={async () => {
                const success = await copyToClipboard(grayscale);
                if (success) {
                  addToast(`已成功复制灰度值: ${grayscale.toUpperCase()}`);
                } else {
                  addToast('复制失败', 'error');
                }
              }}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              复制灰度色值
            </button>
          </div>
        </div>

        <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100">
          <h4 className="font-bold text-indigo-900 mb-2">💡 什么是灰度转换？</h4>
          <p className="text-indigo-700/80 text-sm leading-relaxed">
            灰度转换是将彩色图像通过加权平均（Luminance）算法转换为黑白灰阶的过程。在 UI 设计中，常用于检测界面层级（Visual Hierarchy）和对比度是否在去除色彩后依然清晰。
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default GrayscaleConverter;
