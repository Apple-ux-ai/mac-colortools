/**
 * 功能：Web安全色子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import PageContainer from '../../components/PageContainer';
import { colord } from 'colord';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

const WebSafeColors: React.FC = () => {
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
      addToast(`已成功复制 ${format.toUpperCase()}: ${value}`);
    } else {
      addToast('复制失败', 'error');
    }
  };

  return (
    <PageContainer title="Web 安全色">
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {colors.map(hex => {
            const rgb = colord(hex).toRgb();
            const rgbStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
            
            return (
              <div 
                key={hex}
                className="flex flex-col rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Color Display Area */}
                <div 
                  className="h-24 w-full transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: hex }}
                />
                
                {/* Info and Copy Area */}
                <div className="p-3 bg-slate-50/80 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">HEX</span>
                    <button 
                      onClick={() => handleCopy(hex, 'hex')}
                      className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded-md font-mono text-[11px] font-black text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-left truncate"
                      title={`点击复制 HEX: ${hex.toUpperCase()}`}
                    >
                      {hex.toUpperCase()}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">RGB</span>
                    <button 
                      onClick={() => handleCopy(hex, 'rgb')}
                      className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded-md font-mono text-[11px] font-black text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-left truncate"
                      title={`点击复制 RGB: ${rgbStr}`}
                    >
                      {rgbStr}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 p-8 bg-indigo-50/50 rounded-3xl text-sm text-indigo-900/70 leading-relaxed border border-indigo-100/50">
          <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full" />
            关于 Web 安全色 (Web Safe Colors)
          </h4>
          <p>
            Web 安全色由 216 种颜色组成，这些颜色在 256 色显卡时代的各种显示器上都能保持一致。虽然现代显示器已支持数百万种颜色，但 Web 安全色仍常用于确保极高兼容性的场景，或作为设计时的基础调色盘参考。本工具支持点击色值块快速复制对应的 HEX 或 RGB 格式。
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default WebSafeColors;
