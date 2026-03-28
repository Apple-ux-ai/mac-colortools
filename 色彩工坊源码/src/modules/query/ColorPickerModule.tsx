/**
 * 功能：高级颜色选择器子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import PageContainer from '../../components/PageContainer';
import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import { Info, Copy } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

extend([namesPlugin]);

const ColorPickerModule: React.FC = () => {
  const addToast = useToastStore((state) => state.addToast);
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
    { label: 'Luminance', value: c.luminance().toFixed(16) },
    { 
      label: 'Brightness', 
      value: ((rgba.r * 299 + rgba.g * 587 + rgba.b * 114) / 1000).toFixed(3) 
    },
  ];

  return (
    <PageContainer title="颜色选择器" hideDefaultTitle>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-fuchsia-100 border-2 border-white/50">
              <div className="w-7 h-7 rounded-full border-2 border-white/50 bg-conic-gradient" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">颜色选择器</h1>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-12">
            {/* Left: Interactive Picker Area */}
            <div className="space-y-4">
              <div className="bg-[#f8faff] p-3 rounded-xl border border-[#eef2ff] shadow-sm">
                <div className="flex gap-4">
                  {/* Main Spectrum Area (X: Hue, Y: Value) */}
                  <div 
                    ref={satValRef}
                    className="flex-1 h-[400px] border border-slate-100 rounded-sm relative cursor-crosshair overflow-hidden"
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
                    className="w-8 h-[400px] border border-slate-100 rounded-sm relative cursor-pointer z-[5]"
                    style={{ background: `linear-gradient(to bottom, ${colord({ h: hsva.h, s: hsva.s, v: 100 }).toRgbString()}, #000)` }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleValueMove(e);
                      bindMove(handleValueMove);
                    }}
                  >
                    <div 
                      className="absolute left-[-2px] right-[-2px] h-2 bg-white border border-slate-300 shadow-sm -translate-y-1/2 pointer-events-none rounded-full z-10"
                      style={{ top: `${100 - hsva.v}%` }}
                    />
                  </div>

                  {/* Alpha Slider (Right of sliders) */}
                  <div 
                    ref={alphaRef}
                    className="w-8 h-[400px] border border-slate-100 rounded-sm relative cursor-pointer overflow-hidden z-[5]"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleAlphaMove(e);
                      bindMove(handleAlphaMove);
                    }}
                  >
                    <div className="absolute inset-0 z-0" style={{ backgroundImage: 'conic-gradient(#ccc 25%, transparent 0 50%, #ccc 0 75%, transparent 0)', backgroundSize: '8px 8px' }} />
                    <div className="absolute inset-0 z-[1]" style={{ background: `linear-gradient(to bottom, ${c.alpha(1).toRgbString()}, transparent)` }} />
                    <div 
                      className="absolute left-[-2px] right-[-2px] h-2 bg-white border border-slate-300 shadow-sm -translate-y-1/2 pointer-events-none rounded-full z-10"
                      style={{ top: `${(1 - hsva.a) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* HEX Bar - Full Width with selection background */}
              <div 
                className="w-full p-6 rounded-xl shadow-sm border border-slate-100 transition-all duration-200"
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
                    className={`w-full bg-transparent border-none font-mono text-2xl font-black focus:outline-none ${c.isDark() ? 'text-white' : 'text-slate-800'}`}
                  />
                </div>
              </div>
            </div>

            {/* Right: Info Table */}
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <tbody>
                  {formats.map((f, i) => (
                    <tr key={f.label} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="px-6 py-4 font-bold text-slate-500 w-32 border-b border-r border-slate-50 uppercase tracking-widest">{f.label}</td>
                      <td 
                        className="px-6 py-4 font-mono text-sm text-slate-700 border-b border-slate-50 cursor-pointer hover:text-indigo-600 transition-colors" 
                        onClick={async () => {
                          const success = await copyToClipboard(f.value);
                          if (success) {
                            addToast(`已成功复制 ${f.label}: ${f.value}`);
                          } else {
                            addToast('复制失败', 'error');
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
        <div className="bg-orange-50/50 p-8 rounded-xl border border-orange-100 space-y-4">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-lg">
            <Info size={20} />
            <h3>关于颜色选择器工具的介绍:</h3>
          </div>
          <div className="space-y-3 text-orange-800/80 text-sm leading-relaxed font-medium">
            <p>1、在颜色选择器中选择自己的颜色。</p>
            <p>2、颜色选中后，可以查看与选中颜色对应的颜色值。</p>
            <p>3、另外，此工具也支持颜色的透明值。</p>
            <p>4、注意：由于个人显示器的限制，颜色可能会出现色差。</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ColorPickerModule;
