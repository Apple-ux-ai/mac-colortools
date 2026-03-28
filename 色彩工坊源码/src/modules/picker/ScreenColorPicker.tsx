/**
 * 功能：屏幕拾色子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { Monitor, Copy } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

const ScreenColorPicker: React.FC = () => {
  const addToast = useToastStore((state) => state.addToast);
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePickColor = async () => {
    if (!window.EyeDropper) {
      setError('您的浏览器/环境不支持 EyeDropper API。请确保在现代浏览器或 Electron 软件中使用。');
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
      addToast(`已成功复制: ${text}`);
    } else {
      addToast('复制失败，请重试', 'error');
    }
  };

  return (
    <PageContainer title="屏幕颜色拾取" hideDefaultTitle>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 border-2 border-white/50">
              <Monitor size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">屏幕颜色拾取</h1>
          </div>
        </div>

        <div className="text-center space-y-12">
        <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
          <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto text-indigo-600">
            <Monitor size={48} />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-800">屏幕精准拾色</h3>
            <p className="text-slate-500">点击下方按钮，即可选取屏幕上任意像素的颜色值。</p>
          </div>

          <button 
            onClick={handlePickColor}
            className="w-full py-6 bg-indigo-600 text-white rounded-[24px] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
          >
            <Monitor size={24} />
            开始拾色
          </button>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100">
              {error}
            </div>
          )}
        </div>

        {pickedColor && (
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-6">
              <div 
                className="w-20 h-20 rounded-2xl shadow-inner border-4 border-white"
                style={{ backgroundColor: pickedColor }}
              />
              <div className="text-left">
                <span className="block text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">最近拾取</span>
                <span className="font-mono text-3xl font-black text-slate-800 uppercase">{pickedColor}</span>
              </div>
            </div>
            <button 
              onClick={() => {
                if (pickedColor) {
                  handleCopy(pickedColor);
                }
              }}
              className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all"
            >
              <Copy size={24} />
            </button>
          </div>
        )}

        <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 text-sm text-blue-700 leading-relaxed text-left">
          <h4 className="font-bold mb-2">💡 小贴士</h4>
          <p>EyeDropper API 允许您在整个桌面范围内拾取颜色。如果您正在运行 Electron 客户端，它将无缝支持屏幕任何角落的色彩提取。拾取后，点击色值即可复制到剪贴板。</p>
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
