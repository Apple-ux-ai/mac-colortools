/**
 * 功能：颜色混合子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import { Plus, Equal, Copy, Info, RefreshCw } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

extend([mixPlugin]);

const ColorMixer: React.FC = () => {
  const addToast = useToastStore((state) => state.addToast);
  const [color1, setColor1] = useState('#6366f1');
  const [color2, setColor2] = useState('#f43f5e');
  const [ratio, setRatio] = useState(0.5);

  const mixed = colord(color1).mix(color2, ratio);
  const mixedColor = mixed.toHex();
  const mixedRgb = mixed.toRgbString();

  return (
    <PageContainer title="颜色混合器" hideDefaultTitle>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 border-2 border-white/50">
              <RefreshCw size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">二种颜色混合器</h1>
          </div>
        </div>

        {/* Main Mixing Area */}
        <div className="bg-white p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr,auto,1fr,auto,1.2fr] gap-6 md:gap-8 items-center">
            {/* Color 1 */}
            <div className="space-y-4 max-w-sm mx-auto w-full group">
              <div 
                className="w-full h-32 md:h-40 xl:h-48 rounded-3xl shadow-inner border-4 border-white transition-all duration-500 cursor-pointer relative overflow-hidden" 
                style={{ backgroundColor: color1 }}
                onClick={() => document.getElementById('color1-picker')?.click()}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <RefreshCw className="text-white/0 group-hover:text-white/50 transition-colors" size={24} />
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-indigo-200 focus-within:ring-4 focus-within:ring-indigo-50/50 transition-all">
                  <div 
                    className="w-6 h-6 rounded-lg border border-slate-200 cursor-pointer shrink-0" 
                    style={{ backgroundColor: color1 }}
                    onClick={() => document.getElementById('color1-picker')?.click()}
                  />
                  <input 
                    type="text" 
                    value={color1} 
                    onChange={(e) => setColor1(e.target.value)}
                    className="flex-1 bg-transparent border-none font-mono text-sm uppercase font-bold text-slate-700 focus:outline-none"
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
              <div className="p-3 bg-slate-50 rounded-full text-slate-300 border border-slate-100">
                <Plus size={20} />
              </div>
            </div>

            {/* Color 2 */}
            <div className="space-y-4 max-w-sm mx-auto w-full group">
              <div 
                className="w-full h-32 md:h-40 xl:h-48 rounded-3xl shadow-inner border-4 border-white transition-all duration-500 cursor-pointer relative overflow-hidden" 
                style={{ backgroundColor: color2 }}
                onClick={() => document.getElementById('color2-picker')?.click()}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <RefreshCw className="text-white/0 group-hover:text-white/50 transition-colors" size={24} />
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-indigo-200 focus-within:ring-4 focus-within:ring-indigo-50/50 transition-all">
                  <div 
                    className="w-6 h-6 rounded-lg border border-slate-200 cursor-pointer shrink-0" 
                    style={{ backgroundColor: color2 }}
                    onClick={() => document.getElementById('color2-picker')?.click()}
                  />
                  <input 
                    type="text" 
                    value={color2} 
                    onChange={(e) => setColor2(e.target.value)}
                    className="flex-1 bg-transparent border-none font-mono text-sm uppercase font-bold text-slate-700 focus:outline-none"
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
              <div className="hidden xl:block p-3 bg-slate-50 rounded-full text-slate-400 border border-slate-100">
                <Equal size={20} />
              </div>
              <div className="w-full max-w-md flex flex-col items-center gap-4">
                <div className="w-full flex justify-between text-sm font-bold text-slate-500 uppercase tracking-widest px-1">
                  <span>颜色 1</span>
                  <span>比例</span>
                  <span>颜色 2</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={ratio}
                  onChange={(e) => setRatio(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  {Math.round((1 - ratio) * 100)}% : {Math.round(ratio * 100)}%
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="col-span-full xl:col-span-1 xl:pl-8 xl:border-l xl:border-slate-100 space-y-6">
              <div className="flex xl:flex-col items-center gap-6 xl:gap-2">
                <div className="flex-1 xl:w-full text-center space-y-2">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] block">混合结果</span>
                  <div 
                    className="w-full h-32 md:h-40 xl:h-48 rounded-3xl shadow-2xl border-4 md:border-8 border-white transition-all duration-500 relative group overflow-hidden"
                    style={{ backgroundColor: mixedColor }}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <button 
                        onClick={async () => {
                          const success = await copyToClipboard(mixedColor);
                          if (success) {
                            addToast(`已成功复制混合色: ${mixedColor.toUpperCase()}`);
                          } else {
                            addToast('复制失败', 'error');
                          }
                        }}
                        className="p-3 bg-white/90 backdrop-blur shadow-xl rounded-xl scale-0 group-hover:scale-100 transition-all hover:bg-white active:scale-90"
                      >
                        <Copy size={20} className="text-indigo-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 xl:w-full space-y-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 group hover:border-indigo-100 transition-all">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">HEX</span>
                      <button 
                        onClick={async () => {
                          const success = await copyToClipboard(mixedColor.toUpperCase());
                          if (success) {
                            addToast(`已成功复制 HEX: ${mixedColor.toUpperCase()}`);
                          } else {
                            addToast('复制失败', 'error');
                          }
                        }} 
                        className="text-indigo-400 hover:text-indigo-600"
                      >
                        <Copy size={10} />
                      </button>
                    </div>
                    <div className="font-mono text-sm md:text-base font-black text-slate-800 uppercase">{mixedColor}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 group hover:border-indigo-100 transition-all">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">RGB</span>
                      <button 
                        onClick={async () => {
                          const success = await copyToClipboard(mixedRgb);
                          if (success) {
                            addToast(`已成功复制 RGB: ${mixedRgb}`);
                          } else {
                            addToast('复制失败', 'error');
                          }
                        }} 
                        className="text-indigo-400 hover:text-indigo-600"
                      >
                        <Copy size={10} />
                      </button>
                    </div>
                    <div className="font-mono text-sm font-bold text-slate-600 truncate">{mixedRgb}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-orange-50/50 p-8 rounded-xl border border-orange-100 space-y-4">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-lg">
            <Info size={20} />
            <h3>关于二种颜色混合器介绍:</h3>
          </div>
          <div className="space-y-3 text-orange-800/80 text-sm leading-relaxed font-medium">
            <p>1、此工具可以帮助你混合两种颜色，以获得一种新的颜色，让你更好地表达自己的想法和创意。</p>
            <p>2、输入或选择将要混合的两颜色值，并点击 “开始计算” 按钮（当前为实时更新模式）。</p>
            <p>3、本工具可以输出十六进制和RGB形式的颜色值，并推荐出WEB安全色的数据。</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ColorMixer;
