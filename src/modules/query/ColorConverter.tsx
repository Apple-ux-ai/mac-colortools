/**
 * 功能：颜色格式转换子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/PageContainer';
import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import cmykPlugin from 'colord/plugins/cmyk';
import { Info, Copy, Grid, Zap, Activity, Printer, Layers, Sliders, Hexagon, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../../store/toastStore';
import { usePaletteStore } from '../../store/paletteStore';
import { copyToClipboard } from '../../utils/clipboard';

extend([namesPlugin, cmykPlugin]);

const ColorConverter: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'common' | 'hsv-norm' | 'rgb-hex' | 'rgb-cmyk' | 'hsv-cmyk' | 'rgb-hsv' | 'cmyk-hex'>('common');
  const [color, setColor] = useState('#6366f1');
  const [hsvNorm, setHsvNorm] = useState({ h: '0.6667', s: '0.5843', v: '0.9451' });
  const [rgb, setRgb] = useState({ r: '99', g: '102', b: '241' });
  const [cmyk, setCmyk] = useState({ c: '0.5892', m: '0.5768', y: '0.0000', k: '0.0549' });
  const addToast = useToastStore((state) => state.addToast);
  const setLastPickedColor = usePaletteStore((state) => state.setLastPickedColor);

  const c = colord(color);

  const handleAddToPalette = () => {
    const hex = c.isValid() ? c.toHex() : null;
    if (hex) {
      setLastPickedColor(hex);
      addToast(t('queryConvert.savedToPalette'));
      navigate('/query/palettes');
    }
  };

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
    { label: 'NAME', value: c.toName() || t('queryConvert.unknownName') },
  ];

  return (
    <PageContainer title={t('queryConvert.title')}>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Tabs Control */}
        <div className="flex flex-wrap justify-center bg-slate-100/50 dark:bg-slate-700/50 p-1.5 rounded-3xl border border-slate-100 dark:border-slate-600 w-full max-w-4xl mx-auto gap-1">
          <button
            onClick={() => setActiveTab('common')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'common' 
                ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-600/50 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Grid size={16} />
            {t('queryConvert.tabs.common')}
          </button>
          <button
            onClick={() => setActiveTab('hsv-norm')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'hsv-norm' 
                ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-600/50 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Zap size={16} />
            {t('queryConvert.tabs.hsvNorm')}
          </button>
          <button
            onClick={() => setActiveTab('rgb-hex')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'rgb-hex' 
                ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-600/50 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Activity size={16} />
            {t('queryConvert.tabs.rgbHex')}
          </button>
          <button
            onClick={() => setActiveTab('rgb-cmyk')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'rgb-cmyk' 
                ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-600/50 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Printer size={16} />
            {t('queryConvert.tabs.rgbCmyk')}
          </button>
          <button
            onClick={() => setActiveTab('hsv-cmyk')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'hsv-cmyk' 
                ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-600/50 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Layers size={16} />
            {t('queryConvert.tabs.hsvCmyk')}
          </button>
          <button
            onClick={() => setActiveTab('rgb-hsv')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'rgb-hsv' 
                ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-600/50 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Sliders size={16} />
            {t('queryConvert.tabs.rgbHsv')}
          </button>
          <button
            onClick={() => setActiveTab('cmyk-hex')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'cmyk-hex' 
                ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-600/50 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Hexagon size={16} />
            {t('queryConvert.tabs.cmykHex')}
          </button>
        </div>

        {activeTab === 'common' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-white dark:bg-slate-800 p-10 rounded-[40px] border border-slate-100 dark:border-slate-600 shadow-sm text-center space-y-6">
                <div 
                  className="w-48 h-48 rounded-full mx-auto shadow-2xl border-8 border-white dark:border-slate-600 transition-all duration-500"
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
                  className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl px-6 py-4 font-mono text-2xl text-center uppercase font-black text-indigo-600 dark:text-indigo-300"
                  placeholder="#000000"
                />
                <button
                  type="button"
                  onClick={handleAddToPalette}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200 rounded-2xl font-bold hover:bg-indigo-100 dark:hover:bg-indigo-800/60 transition-colors"
                >
                  <Bookmark size={20} />
                  {t('queryPalette.addColor')}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {formats.map((f) => (
                <div key={f.label} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-600 shadow-sm flex items-center justify-between group hover:border-indigo-100 dark:hover:border-indigo-700 transition-all">
                  <div>
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-1 block">{f.label}</span>
                    <span className="font-mono text-lg font-bold text-slate-700 dark:text-slate-200">{f.value}</span>
                  </div>
                  <button 
                    onClick={async () => {
                      const success = await copyToClipboard(f.value);
                      if (success) {
                        addToast(t('toast.copySuccessPlain', { value: `${f.label}: ${f.value}` }));
                      } else {
                        addToast(t('toast.copyFailRetry'), 'error');
                      }
                    }}
                    className="px-4 py-2 bg-slate-50 dark:bg-slate-600 text-slate-400 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    {t('common.copy')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hsv-norm' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm overflow-hidden">
              {/* HEX Input */}
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
                  HEX
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 dark:text-slate-200 focus:outline-none uppercase"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* TO Separator */}
              <div className="bg-white dark:bg-slate-700 py-3 text-center text-xs font-bold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-600 tracking-[0.3em] uppercase">
                TO
              </div>

              {/* H Input */}
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm overflow-hidden">
              {/* R Input */}
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs text-center">
                  {t('queryConvert.labels.red')}
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs text-center">
                  {t('queryConvert.labels.green')}
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs text-center">
                  {t('queryConvert.labels.blue')}
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
              <div className="bg-white dark:bg-slate-700 py-3 text-center text-xs font-bold text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-600 tracking-[0.3em] uppercase">
                TO
              </div>

              {/* HEX Input */}
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
                  {t('queryConvert.labels.hexValue')}
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 dark:text-slate-200 focus:outline-none uppercase"
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
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm overflow-hidden">
              {/* R Input */}
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs text-center">
                  {t('queryConvert.labels.red')}
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs text-center">
                  {t('queryConvert.labels.green')}
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs text-center">
                  {t('queryConvert.labels.blue')}
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
              <div className="bg-white dark:bg-slate-700 py-3 text-center text-xs font-bold text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-600 tracking-[0.3em] uppercase">
                TO
              </div>

              {/* C Input */}
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm overflow-hidden">
              {/* H Input */}
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
              <div className="bg-white dark:bg-slate-700 py-3 text-center text-xs font-bold text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-600 tracking-[0.3em] uppercase">
                TO
              </div>

              {/* C Input */}
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm overflow-hidden">
              {/* R Input */}
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs text-center">
                  {t('queryConvert.labels.red')}
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs text-center">
                  {t('queryConvert.labels.green')}
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs text-center">
                  {t('queryConvert.labels.blue')}
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
              <div className="bg-white dark:bg-slate-700 py-3 text-center text-xs font-bold text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-600 tracking-[0.3em] uppercase">
                TO
              </div>

              {/* H Input */}
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm overflow-hidden">
              {/* HEX Input */}
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
                  HEX
                </div>
                <div className="flex-1 px-4 py-4 flex items-center">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-transparent border-none font-mono text-lg font-bold text-slate-700 dark:text-slate-200 focus:outline-none uppercase"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* TO Separator */}
              <div className="bg-white dark:bg-slate-700 py-3 text-center text-xs font-bold text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-600 tracking-[0.3em] uppercase">
                TO
              </div>

              {/* C Input */}
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
              <div className="flex border-b border-slate-200 dark:border-slate-600">
                <div className="w-32 bg-slate-50 dark:bg-slate-700 px-4 py-4 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 uppercase tracking-widest text-xs">
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
          <h3>{t('queryConvert.aboutTitle')}</h3>
        </div>
        <div className="space-y-3 text-indigo-800/80 text-sm leading-relaxed font-medium">
          <p>{t('queryConvert.about1')}</p>
          <p>{t('queryConvert.about2')}</p>
          <p>{t('queryConvert.about3')}</p>
          <p>{t('queryConvert.about4')}</p>
          <p>{t('queryConvert.about5')}</p>
          <p>{t('queryConvert.about6')}</p>
          <p>{t('queryConvert.about7')}</p>
          <p>{t('queryConvert.about8')}</p>
          <p>{t('queryConvert.about9')}</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default ColorConverter;
