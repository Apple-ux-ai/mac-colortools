/**
 * 功能：颜色格式转换子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/PageContainer';
import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import cmykPlugin from 'colord/plugins/cmyk';
import { Info, Copy, Grid, Zap, Activity, Printer, Layers, Sliders, Hexagon } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

extend([namesPlugin, cmykPlugin]);

const ColorConverter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'common' | 'hsv-norm' | 'rgb-hex' | 'rgb-cmyk' | 'hsv-cmyk' | 'rgb-hsv' | 'cmyk-hex'>('common');
  const [color, setColor] = useState('#6366f1');
  const [hsvNorm, setHsvNorm] = useState({ h: '0.6667', s: '0.5843', v: '0.9451' });
  const [rgb, setRgb] = useState({ r: '99', g: '102', b: '241' });
  const [cmyk, setCmyk] = useState({ c: '0.5892', m: '0.5768', y: '0.0000', k: '0.0549' });
  const addToast = useToastStore((state) => state.addToast);
  
  const c = colord(color);

  // 同步所有颜色状态
  useEffect(() => {
    const currentHsv = c.toHsv();
    const currentRgb = c.toRgb();
    const currentCmyk = c.toCmyk();
    
    setHsvNorm({
      h: (currentHsv.h / 360).toFixed(4),
      s: (currentHsv.s / 100).toFixed(4),
      v: (currentHsv.v / 100).toFixed(4),
    });
    
    setRgb({
      r: currentRgb.r.toString(),
      g: currentRgb.g.toString(),
      b: currentRgb.b.toString(),
    });

    setCmyk({
      c: (currentCmyk.c / 100).toFixed(4),
      m: (currentCmyk.m / 100).toFixed(4),
      y: (currentCmyk.y / 100).toFixed(4),
      k: (currentCmyk.k / 100).toFixed(4),
    });
  }, [color]);

  const handleHsvNormChange = (key: 'h' | 's' | 'v', val: string) => {
    setHsvNorm(prev => ({ ...prev, [key]: val }));
    
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const nextHsv = {
        h: parseFloat(key === 'h' ? val : hsvNorm.h),
        s: parseFloat(key === 's' ? val : hsvNorm.s),
        v: parseFloat(key === 'v' ? val : hsvNorm.v),
      };
      
      const newC = colord({
        h: (nextHsv.h || 0) * 360,
        s: (nextHsv.s || 0) * 100,
        v: (nextHsv.v || 0) * 100,
      });
      
      if (newC.isValid()) {
        const newHex = newC.toHex().toUpperCase();
        if (newHex !== color.toUpperCase()) {
          setColor(newHex);
        }
      }
    }
  };

  const handleRgbChange = (key: 'r' | 'g' | 'b', val: string) => {
    // 仅允许数字输入
    const cleanVal = val.replace(/[^\d]/g, '');
    if (cleanVal === '' || (parseInt(cleanVal) >= 0 && parseInt(cleanVal) <= 255)) {
      setRgb(prev => ({ ...prev, [key]: cleanVal }));
      
      const num = parseInt(cleanVal);
      if (!isNaN(num)) {
        const nextRgb = {
          r: parseInt(key === 'r' ? cleanVal : rgb.r) || 0,
          g: parseInt(key === 'g' ? cleanVal : rgb.g) || 0,
          b: parseInt(key === 'b' ? cleanVal : rgb.b) || 0,
        };
        
        const newC = colord(nextRgb);
        if (newC.isValid()) {
          const newHex = newC.toHex().toUpperCase();
          if (newHex !== color.toUpperCase()) {
            setColor(newHex);
          }
        }
      }
    }
  };

  const handleCmykChange = (key: 'c' | 'm' | 'y' | 'k', val: string) => {
    setCmyk(prev => ({ ...prev, [key]: val }));
    
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const nextCmyk = {
        c: parseFloat(key === 'c' ? val : cmyk.c) || 0,
        m: parseFloat(key === 'm' ? val : cmyk.m) || 0,
        y: parseFloat(key === 'y' ? val : cmyk.y) || 0,
        k: parseFloat(key === 'k' ? val : cmyk.k) || 0,
      };
      
      const newC = colord({
        c: (nextCmyk.c || 0) * 100,
        m: (nextCmyk.m || 0) * 100,
        y: (nextCmyk.y || 0) * 100,
        k: (nextCmyk.k || 0) * 100,
      });
      
      if (newC.isValid()) {
        const newHex = newC.toHex().toUpperCase();
        if (newHex !== color.toUpperCase()) {
          setColor(newHex);
        }
      }
    }
  };

  const formats = [
    { label: 'HEX', value: c.toHex().toUpperCase() },
    { label: 'RGB', value: c.toRgbString() },
    { label: 'HSL', value: c.toHslString() },
    { label: 'HSV', value: `hsv(${Math.round(c.toHsv().h)}, ${Math.round(c.toHsv().s)}%, ${Math.round(c.toHsv().v)}%)` },
    { label: 'NAME', value: c.toName() || 'Unknown' },
  ];

  return (
    <PageContainer title="颜色值转换">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Tabs Control */}
        <div className="flex flex-wrap justify-center bg-slate-100/50 p-1.5 rounded-3xl border border-slate-100 w-full max-w-4xl mx-auto gap-1">
          <button
            onClick={() => setActiveTab('common')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'common' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
          >
            <Grid size={16} />
            常用格式
          </button>
          <button
            onClick={() => setActiveTab('hsv-norm')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'hsv-norm' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
          >
            <Zap size={16} />
            HSV 归一化
          </button>
          <button
            onClick={() => setActiveTab('rgb-hex')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'rgb-hex' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
          >
            <Activity size={16} />
            RGB/16进制
          </button>
          <button
            onClick={() => setActiveTab('rgb-cmyk')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'rgb-cmyk' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
          >
            <Printer size={16} />
            RGB/CMYK
          </button>
          <button
            onClick={() => setActiveTab('hsv-cmyk')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'hsv-cmyk' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
          >
            <Layers size={16} />
            HSV/CMYK
          </button>
          <button
            onClick={() => setActiveTab('rgb-hsv')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'rgb-hsv' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
          >
            <Sliders size={16} />
            RGB/HSV
          </button>
          <button
            onClick={() => setActiveTab('cmyk-hex')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'cmyk-hex' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
          >
            <Hexagon size={16} />
            CMYK/16进制
          </button>
        </div>

        {activeTab === 'common' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center space-y-6">
                <div 
                  className="w-48 h-48 rounded-full mx-auto shadow-2xl border-8 border-white transition-all duration-500"
                  style={{ backgroundColor: color }}
                />
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-16 rounded-2xl cursor-pointer"
                />
                <input 
                  type="text" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-mono text-2xl text-center uppercase font-black text-indigo-600"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="space-y-4">
              {formats.map((f) => (
                <div key={f.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
                  <div>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-1 block">{f.label}</span>
                    <span className="font-mono text-lg font-bold text-slate-700">{f.value}</span>
                  </div>
                  <button 
                    onClick={async () => {
                      const success = await copyToClipboard(f.value);
                      if (success) {
                        addToast(`已成功复制 ${f.label}: ${f.value}`);
                      } else {
                        addToast('复制失败', 'error');
                      }
                    }}
                    className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    复制
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hsv-norm' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              {/* HEX Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  HEX
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none uppercase"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* TO Separator */}
              <div className="bg-white py-3 text-center text-xs font-bold text-slate-600 border-b border-slate-200 tracking-[0.3em] uppercase">
                TO
              </div>

              {/* H Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  H (0-1)
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={hsvNorm.h}
                    onChange={(e) => handleHsvNormChange('h', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* S Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  S (0-1)
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={hsvNorm.s}
                    onChange={(e) => handleHsvNormChange('s', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* V Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  V (0-1)
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={hsvNorm.v}
                    onChange={(e) => handleHsvNormChange('v', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Color Block */}
              <div 
                className="h-16 w-full transition-all duration-300"
                style={{ backgroundColor: colord(color).isValid() ? color : '#000' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'rgb-hex' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              {/* R Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs text-center">
                  红(R:0~255)
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={rgb.r}
                    onChange={(e) => handleRgbChange('r', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* G Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs text-center">
                  绿(G:0~255)
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={rgb.g}
                    onChange={(e) => handleRgbChange('g', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* B Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs text-center">
                  蓝(B:0~255)
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={rgb.b}
                    onChange={(e) => handleRgbChange('b', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* TO Separator */}
              <div className="bg-white py-3 text-center text-xs font-bold text-slate-400 border-b border-slate-200 tracking-[0.3em] uppercase">
                TO
              </div>

              {/* HEX Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  HEX 值
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none uppercase"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Color Block */}
              <div 
                className="h-16 w-full transition-all duration-300"
                style={{ backgroundColor: colord(color).isValid() ? color : '#000' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'rgb-cmyk' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              {/* R Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs text-center">
                  红(R:0~255)
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={rgb.r}
                    onChange={(e) => handleRgbChange('r', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* G Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs text-center">
                  绿(G:0~255)
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={rgb.g}
                    onChange={(e) => handleRgbChange('g', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* B Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs text-center">
                  蓝(B:0~255)
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={rgb.b}
                    onChange={(e) => handleRgbChange('b', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* TO Separator */}
              <div className="bg-white py-3 text-center text-xs font-bold text-slate-400 border-b border-slate-200 tracking-[0.3em] uppercase">
                TO
              </div>

              {/* C Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  C
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={cmyk.c}
                    onChange={(e) => handleCmykChange('c', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* M Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  M
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={cmyk.m}
                    onChange={(e) => handleCmykChange('m', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Y Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  Y
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={cmyk.y}
                    onChange={(e) => handleCmykChange('y', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* K Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  K
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={cmyk.k}
                    onChange={(e) => handleCmykChange('k', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Color Block */}
              <div 
                className="h-16 w-full transition-all duration-300"
                style={{ backgroundColor: colord(color).isValid() ? color : '#000' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'hsv-cmyk' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              {/* H Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  H
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={hsvNorm.h}
                    onChange={(e) => handleHsvNormChange('h', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* S Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  S
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={hsvNorm.s}
                    onChange={(e) => handleHsvNormChange('s', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* V Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  V
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={hsvNorm.v}
                    onChange={(e) => handleHsvNormChange('v', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* TO Separator */}
              <div className="bg-white py-3 text-center text-xs font-bold text-slate-400 border-b border-slate-200 tracking-[0.3em] uppercase">
                TO
              </div>

              {/* C Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  C
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={cmyk.c}
                    onChange={(e) => handleCmykChange('c', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* M Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  M
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={cmyk.m}
                    onChange={(e) => handleCmykChange('m', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Y Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  Y
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={cmyk.y}
                    onChange={(e) => handleCmykChange('y', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* K Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  K
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={cmyk.k}
                    onChange={(e) => handleCmykChange('k', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Color Block */}
              <div 
                className="h-16 w-full transition-all duration-300"
                style={{ backgroundColor: colord(color).isValid() ? color : '#000' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'rgb-hsv' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              {/* R Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs text-center">
                  红(R:0~255)
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={rgb.r}
                    onChange={(e) => handleRgbChange('r', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* G Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs text-center">
                  绿(G:0~255)
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={rgb.g}
                    onChange={(e) => handleRgbChange('g', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* B Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs text-center">
                  蓝(B:0~255)
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={rgb.b}
                    onChange={(e) => handleRgbChange('b', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* TO Separator */}
              <div className="bg-white py-3 text-center text-xs font-bold text-slate-400 border-b border-slate-200 tracking-[0.3em] uppercase">
                TO
              </div>

              {/* H Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  H
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={hsvNorm.h}
                    onChange={(e) => handleHsvNormChange('h', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* S Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  S
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={hsvNorm.s}
                    onChange={(e) => handleHsvNormChange('s', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* V Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  V
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={hsvNorm.v}
                    onChange={(e) => handleHsvNormChange('v', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Color Block */}
              <div 
                className="h-16 w-full transition-all duration-300"
                style={{ backgroundColor: colord(color).isValid() ? color : '#000' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'cmyk-hex' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              {/* HEX Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  HEX
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none uppercase"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* TO Separator */}
              <div className="bg-white py-3 text-center text-xs font-bold text-slate-400 border-b border-slate-200 tracking-[0.3em] uppercase">
                TO
              </div>

              {/* C Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  C
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={cmyk.c}
                    onChange={(e) => handleCmykChange('c', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* M Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  M
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={cmyk.m}
                    onChange={(e) => handleCmykChange('m', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Y Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  Y
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={cmyk.y}
                    onChange={(e) => handleCmykChange('y', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* K Input */}
              <div className="flex border-b border-slate-200">
                <div className="w-32 bg-slate-50 px-4 py-4 flex items-center justify-center font-bold text-slate-500 border-r border-slate-200 uppercase tracking-widest text-xs">
                  K
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={cmyk.k}
                    onChange={(e) => handleCmykChange('k', e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Color Block */}
              <div 
                className="h-16 w-full transition-all duration-300"
                style={{ backgroundColor: colord(color).isValid() ? color : '#000' }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* About Section */}
      <div className="mt-12 bg-indigo-50/50 p-8 rounded-xl border border-indigo-100 space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
          <Info size={20} />
          <h3>关于颜色值转换介绍:</h3>
        </div>
        <div className="space-y-3 text-indigo-800/80 text-sm leading-relaxed font-medium">
          <p>1、此工具可以将单一颜色值在多种常用色彩空间（如 HEX, RGB, HSL, HSV）之间进行无缝转换。</p>
          <p>2、您可以直接在输入框中输入十六进制色值，或使用颜色选择器进行实时选取，转换结果将即时呈现。</p>
        <p>3、<b>HSV 归一化转换</b> 支持将 HSV 值的显示范围归一化为 0 到 1 之间，方便图形处理和数学计算。</p>
        <p>4、<b>RGB/16进制转换</b> 提供直观的 R、G、B 分量输入方式（0-255），并与 16 进制色值进行快速互转。</p>
        <p>5、<b>RGB/CMYK 转换</b> 支持 RGB 与印刷常用的 CMYK 模式之间的双向转换，方便设计稿的色彩校对。</p>
        <p>6、<b>HSV/CMYK 转换</b> 支持归一化 HSV 与 CMYK 之间的直接互转，满足更多专业设计场景的需求。</p>
        <p>7、<b>RGB/HSV 转换</b> 提供标准的 RGB 分量与归一化 HSV 之间的直观转换界面。</p>
        <p>8、<b>CMYK/16进制转换</b> 实现印刷颜色模型与网页颜色的快速对应转换。</p>
        <p>9、支持色彩命名识别（如可用时显示对应的英文名称），并提供一键复制功能，方便在设计和开发中使用。</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default ColorConverter;
