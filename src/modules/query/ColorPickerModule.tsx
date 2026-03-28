/**
 * 功能：高级颜色选择器子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/PageContainer';
import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import { Info, Copy, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../../store/toastStore';
import { usePaletteStore } from '../../store/paletteStore';
import { copyToClipboard } from '../../utils/clipboard';

extend([namesPlugin]);

const ColorPickerModule: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const setLastPickedColor = usePaletteStore((state) => state.setLastPickedColor);
  const [hsva, setHsva] = useState({ h: 210, s: 50, v: 50, a: 1 });
  const satValRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);

  const c = colord(hsva);
  const hex = c.toHex();
  const rgba = c.toRgb();

  // 处理主颜色区域 (Hue-Saturation Area)
  // 按照图片显示，X 轴为色相 (Hue)，Y 轴为饱和度/亮度 (SV)
  // 这里我们采用 X 为 Hue (0-360), Y 为 Saturation (0-100) 或 Value (0-100)
  // 图片中看起来更像是 X=Hue, Y=Value
  const handleMainAreaMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!satValRef.current) return;
    const { left, top, width, height } = satValRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - left) / width));
    const y = Math.max(0, Math.min(1, (e.clientY - top) / height));
    
    setHsva(prev => ({ 
      ...prev, 
      h: x * 360, 
      v: (1 - y) * 100,
      s: 100 
    }));
  }, []);

  // 处理亮度滑块 (Value Slider) - 对应图片左侧滑块
  const handleValueMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!hueRef.current) return;
    const { top, height } = hueRef.current.getBoundingClientRect();
    const y = Math.max(0, Math.min(1, (e.clientY - top) / height));
    setHsva(prev => ({ ...prev, v: (1 - y) * 100 }));
  }, []);

  // 处理透明度滑块 (Alpha Slider) - 对应图片右侧滑块
  const handleAlphaMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!alphaRef.current) return;
    const { top, height } = alphaRef.current.getBoundingClientRect();
    const y = Math.max(0, Math.min(1, (e.clientY - top) / height));
    setHsva(prev => ({ ...prev, a: 1 - y }));
  }, []);

  // 统一的鼠标事件绑定
  const bindMove = (moveHandler: (e: MouseEvent) => void) => {
    const onMouseMove = (e: MouseEvent) => moveHandler(e);
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const formats = [
    { label: 'ALPHA', value: hsva.a.toFixed(2) },
    { label: 'HEX', value: c.toHex().slice(0, 7) },
    { label: 'HEXA', value: c.toHex() },
    { label: 'RGB', value: c.toRgbString() },
    { 
      label: 'PRGB', 
      value: `rgb(${Math.round(rgba.r/255*100)}%, ${Math.round(rgba.g/255*100)}%, ${Math.round(rgba.b/255*100)}%)` 
    },
    { 
      label: 'HSV', 
      value: `hsv(${Math.round(hsva.h)}, ${Math.round(hsva.s)}%, ${Math.round(hsva.v)}%)` 
    },
    { 
      label: 'HSL', 
      value: `hsl(${Math.round(c.toHsl().h)}, ${Math.round(c.toHsl().s)}%, ${Math.round(c.toHsl().l)}%)` 
    },
    { label: t('queryPicker.luminance'), value: c.luminance().toFixed(16) },
    { 
      label: t('queryPicker.brightness'), 
      value: ((rgba.r * 299 + rgba.g * 587 + rgba.b * 114) / 1000).toFixed(3) 
    },
  ];

  return (
    <PageContainer title={t('queryPicker.title')} hideDefaultTitle>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-fuchsia-100 dark:shadow-fuchsia-900/30 border-2 border-white/50 dark:border-slate-600/50">
              <div className="w-7 h-7 rounded-full border-2 border-white/50 dark:border-slate-500/50 bg-conic-gradient" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{t('queryPicker.title')}</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setLastPickedColor(hex);
              addToast(t('queryConvert.savedToPalette'));
              navigate('/query/palettes');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200 rounded-xl font-bold hover:bg-indigo-100 dark:hover:bg-indigo-800/60 transition-colors"
          >
            <Bookmark size={20} />
            {t('queryPalette.addColor')}
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-600 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-12">
            {/* Left: Interactive Picker Area */}
            <div className="space-y-4">
              <div className="bg-[#f8faff] dark:bg-slate-700/60 p-3 rounded-xl border border-[#eef2ff] dark:border-slate-600 shadow-sm">
                <div className="flex gap-4">
                  {/* Main Spectrum Area (X: Hue, Y: Value) */}
                  <div 
                    ref={satValRef}
                    className="flex-1 h-[400px] border border-slate-100 dark:border-slate-500 rounded-sm relative cursor-crosshair overflow-hidden"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMainAreaMove(e);
                      bindMove(handleMainAreaMove);
                    }}
                  >
                    {/* Hue Gradient */}
                    <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)' }} />
                    {/* Value/Brightness Overlay */}
                    <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to top, #000, transparent 50%, transparent)' }} />
                    <div className="absolute inset-0 z-[2]" style={{ background: 'linear-gradient(to bottom, #fff, transparent 50%, transparent)' }} />
                    
                    {/* Pointer */}
                    <div 
                      className="absolute w-4 h-4 border-2 border-white rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.5)] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                      style={{ 
                        left: `${(hsva.h / 360) * 100}%`, 
                        top: `${100 - hsva.v}%`,
                        backgroundColor: c.toRgbString()
                      }}
                    />
                  </div>

                  {/* Value Slider (Left of sliders) */}
                  <div 
                    ref={hueRef}
                    className="w-8 h-[400px] border border-slate-100 dark:border-slate-500 rounded-sm relative cursor-pointer z-[5]"
                    style={{ background: `linear-gradient(to bottom, ${colord({ h: hsva.h, s: hsva.s, v: 100 }).toRgbString()}, #000)` }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleValueMove(e);
                      bindMove(handleValueMove);
                    }}
                  >
                    <div 
                      className="absolute left-[-2px] right-[-2px] h-2 bg-white dark:bg-slate-400 border border-slate-300 dark:border-slate-500 shadow-sm -translate-y-1/2 pointer-events-none rounded-full z-10"
                      style={{ top: `${100 - hsva.v}%` }}
                    />
                  </div>

                  {/* Alpha Slider (Right of sliders) */}
                  <div 
                    ref={alphaRef}
                    className="w-8 h-[400px] border border-slate-100 dark:border-slate-500 rounded-sm relative cursor-pointer overflow-hidden z-[5]"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleAlphaMove(e);
                      bindMove(handleAlphaMove);
                    }}
                  >
                    <div className="absolute inset-0 z-0" style={{ backgroundImage: 'conic-gradient(#ccc 25%, transparent 0 50%, #ccc 0 75%, transparent 0)', backgroundSize: '8px 8px' }} />
                    <div className="absolute inset-0 z-[1]" style={{ background: `linear-gradient(to bottom, ${c.alpha(1).toRgbString()}, transparent)` }} />
                    <div 
                      className="absolute left-[-2px] right-[-2px] h-2 bg-white dark:bg-slate-400 border border-slate-300 dark:border-slate-500 shadow-sm -translate-y-1/2 pointer-events-none rounded-full z-10"
                      style={{ top: `${(1 - hsva.a) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* HEX Bar - Full Width with selection background */}
              <div 
                className="w-full p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-600 transition-all duration-200"
                style={{ backgroundColor: c.alpha(1).toRgbString() }}
              >
                <div className="flex items-center gap-4">
                  <input 
                    type="text" 
                    value={hex} 
                    onChange={(e) => {
                      const newColor = colord(e.target.value);
                      if (newColor.isValid()) {
                        const hsv = newColor.toHsv();
                        setHsva({ ...hsv, a: hsv.a ?? 1 });
                      }
                    }}
                    className={`w-full bg-transparent border-none font-mono text-2xl font-black focus:outline-none ${c.isDark() ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}
                  />
                </div>
              </div>
            </div>

            {/* Right: Info Table */}
            <div className="border border-slate-100 dark:border-slate-600 rounded-xl overflow-hidden bg-white dark:bg-slate-700/50">
              <table className="w-full text-sm text-left">
                <tbody>
                  {formats.map((f, i) => (
                    <tr key={f.label} className={i % 2 === 0 ? 'bg-white dark:bg-slate-800/50' : 'bg-slate-50/50 dark:bg-slate-700/50'}>
                      <td className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 w-32 border-b border-r border-slate-50 dark:border-slate-600 uppercase tracking-widest">{f.label}</td>
                      <td 
                        className="px-6 py-4 font-mono text-sm text-slate-700 dark:text-slate-200 border-b border-slate-50 dark:border-slate-600 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" 
                        onClick={async () => {
                          const success = await copyToClipboard(f.value);
                          if (success) {
                            addToast(t('toast.copySuccessPlain', { value: `${f.label}: ${f.value}` }));
                          } else {
                            addToast(t('toast.copyFailRetry'), 'error');
                          }
                        }}
                      >
                        {f.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-orange-50/50 dark:bg-amber-900/20 p-8 rounded-xl border border-orange-100 dark:border-amber-800/50 space-y-4">
          <div className="flex items-center gap-2 text-orange-600 dark:text-amber-400 font-bold text-lg">
            <Info size={20} />
            <h3>{t('queryPicker.aboutTitle')}</h3>
          </div>
          <div className="space-y-3 text-orange-800/80 dark:text-amber-200/90 text-sm leading-relaxed font-medium">
            <p>{t('queryPicker.about1')}</p>
            <p>{t('queryPicker.about2')}</p>
            <p>{t('queryPicker.about3')}</p>
            <p>{t('queryPicker.about4')}</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ColorPickerModule;
