/**
 * 功能：主应用入口与路由配置
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Palette, Pipette, Calculator, Search, Home, MessageSquare } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// 模块主页
import HomeDashboard from './modules/Home';
import TraditionalDashboard from './modules/Traditional';
import PickerDashboard from './modules/Picker';
import CalcDashboard from './modules/Calc';
import QueryDashboard from './modules/Query';

// 传统色彩子页
import ChineseTraditionalColors from './modules/traditional/ChineseTraditionalColors';
import JapaneseTraditionalColors from './modules/traditional/JapaneseTraditionalColors';

// 拾色器子页
import ImageColorPicker from './modules/picker/ImageColorPicker';
import ScreenColorPicker from './modules/picker/ScreenColorPicker';

// 计算处理子页
import GrayscaleConverter from './modules/calc/GrayscaleConverter';
import ImageGrayscaleConverter from './modules/calc/ImageGrayscaleConverter';
import ColorMixer from './modules/calc/ColorMixer';
import IntermediateColors from './modules/calc/IntermediateColors';
import ContrastChecker from './modules/calc/ContrastChecker';
import OppositeColor from './modules/calc/OppositeColor';

// 查询工具子页
import ColorConverter from './modules/query/ColorConverter';
import ColorPickerModule from './modules/query/ColorPickerModule';
import GradientCollection from './modules/query/GradientCollection';
import WebSafeColors from './modules/query/WebSafeColors';
import RGBReferenceTable from './modules/query/RGBReferenceTable';
import CMYKReferenceTable from './modules/query/CMYKReferenceTable';

import Toast from './components/Toast';
import logoIcon from '/d897a4570f2f9ae44ece196d7a181b71.png';
import kqIcon from '/kq-55_256x256.ico';
import { RefreshCw } from 'lucide-react';
import UserAuth from './components/UserAuth';
import AdBanner from './components/AdBanner';

// WindowControls 组件不再需要，改用系统原生标题栏
// import WindowControls from './components/WindowControls';

const App: React.FC = () => {
  const location = useLocation();
  const [isAtMinSize, setIsAtMinSize] = React.useState({ width: false, height: false });

  // 监听窗口尺寸以提供视觉提示
  React.useEffect(() => {
    const checkSize = () => {
      // 这里的阈值略大于 Electron 设置的 minWidth/minHeight，以便在接近时触发
      setIsAtMinSize({
        width: window.innerWidth <= 1024,
        height: window.innerHeight <= 768
      });
    };

    window.addEventListener('resize', checkSize);
    checkSize();
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const tabs = [
    { id: 'home', name: '应用首页', path: '/home', icon: Home },
    { id: 'calc', name: '计算处理', path: '/calc', icon: Calculator },
    { id: 'query', name: '查询工具', path: '/query', icon: Search },
    { id: 'traditional', name: '传统色彩', path: '/traditional', icon: Palette },
    { id: 'picker', name: '拾取提取', path: '/picker', icon: Pipette },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className={`flex h-screen bg-slate-50 text-slate-900 overflow-hidden transition-all duration-300 relative ${
      (isAtMinSize.width || isAtMinSize.height) ? 'ring-4 ring-inset ring-indigo-500/20' : ''
    }`}>
      {/* 移除自定义窗口控制条，使用系统原生标题栏 */}
      {/* <div className="absolute top-0 right-0 h-10 z-[9999] flex window-no-drag">
        <WindowControls />
      </div> */}

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20 shadow-xl">
        <div className="p-6 border-b border-slate-50 flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 overflow-hidden">
            <img src={logoIcon} alt="Logo" className="w-full h-full object-cover p-1" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-800 leading-none mb-1">色彩工坊</h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] leading-none">Color Tools</p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0">
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = isActive(tab.path);
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`w-full flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 group ${
                    active
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-bold translate-x-1'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <Icon size={22} className={active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} />
                  <span className="text-base">{tab.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Ad - position_04 (2:3) */}
          <div className="px-4 pb-4 mt-auto shrink-0 border-t border-slate-50 pt-3 space-y-3">
            <AdBanner position="adv_position_04" aspectRatio="2/3" className="w-full shadow-lg" />
            
            {/* Custom Software Button */}
            <button 
              onClick={async () => {
                try {
                  const { shell } = (window as any).require ? (window as any).require('electron') : { shell: null };
                  const axios = (await import('axios')).default;
                  const response = await axios.post('https://api-web.kunqiongai.com/soft_desktop/get_custom_url');
                  if (response.data.code === 1 && response.data.data.url) {
                    if (shell) {
                      shell.openExternal(response.data.data.url);
                    } else {
                      window.open(response.data.data.url, '_blank');
                    }
                  }
                } catch (error) {
                  console.error('获取定制链接失败:', error);
                }
              }}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <img src={kqIcon} alt="KQ" className="w-4 h-4 rounded-sm" />
              <span className="tracking-widest">我要定制软件</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* Problem Feedback Button */}
            <button 
              onClick={async () => {
                try {
                  const { shell } = (window as any).require ? (window as any).require('electron') : { shell: null };
                  const axios = (await import('axios')).default;
                  // 根据文档接口: 获得软件问题反馈页面链接
                  const response = await axios.post('https://api-web.kunqiongai.com/soft_desktop/get_feedback_url');
                  if (response.data.code === 1 && response.data.data.url) {
                    // 拼接实际的软件编号 soft_number (10024)
                    const finalUrl = `${response.data.data.url}10024`;
                    if (shell) {
                      shell.openExternal(finalUrl);
                    } else {
                      window.open(finalUrl, '_blank');
                    }
                  }
                } catch (error) {
                  console.error('获取反馈链接失败:', error);
                }
              }}
              className="w-full py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <MessageSquare size={18} className="text-indigo-600 group-hover:scale-110 transition-transform" />
              <span className="tracking-tight">问题反馈</span>
            </button>

            {/* Check Update Button */}
            <button 
              onClick={() => {
                const { ipcRenderer } = (window as any).require ? (window as any).require('electron') : { ipcRenderer: null };
                if (ipcRenderer) {
                    ipcRenderer.send('check-for-update');
                } else {
                    console.warn('Not in Electron environment');
                }
              }}
              className="w-full flex items-center justify-center gap-2 p-2 text-slate-400 hover:text-indigo-600 transition-colors group"
            >
              <RefreshCw size={14} className="group-hover:animate-spin" />
              <span className="text-xs font-medium">检查更新</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Header with User Auth */}
        <header className="h-20 border-b border-slate-100 flex items-center justify-between pl-10 pr-10 bg-white/50 backdrop-blur-md z-[101] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-sm font-black text-slate-600 uppercase tracking-[0.2em]">
              {tabs.find(t => isActive(t.path))?.name || '应用首页'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Top Ad - position_01 (4:1) */}
            <AdBanner position="adv_position_01" aspectRatio="4/1" className="h-10 hidden md:block" />
            <UserAuth />
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="flex-1 overflow-auto p-6 md:p-10 flex flex-col"
          >
            <div className="w-full flex-1 flex flex-col">
              <Routes location={location}>
                {/* 仪表盘 */}
                <Route path="/" element={<HomeDashboard />} />
                <Route path="/home" element={<HomeDashboard />} />
                <Route path="/traditional" element={<TraditionalDashboard />} />
                <Route path="/picker" element={<PickerDashboard />} />
                <Route path="/calc" element={<CalcDashboard />} />
                <Route path="/query" element={<QueryDashboard />} />

                {/* 传统色彩子页 */}
                <Route path="/traditional/china" element={<ChineseTraditionalColors />} />
                <Route path="/traditional/japan" element={<JapaneseTraditionalColors />} />

                {/* 拾色器子页 */}
                <Route path="/picker/image" element={<ImageColorPicker />} />
                <Route path="/picker/screen" element={<ScreenColorPicker />} />

                {/* 计算处理子页 */}
                <Route path="/calc/grayscale" element={<ImageGrayscaleConverter />} />
                <Route path="/calc/color-grayscale" element={<GrayscaleConverter />} />
                <Route path="/calc/mix" element={<ColorMixer />} />
                <Route path="/calc/intermediate" element={<IntermediateColors />} />
                <Route path="/calc/contrast" element={<ContrastChecker />} />
                <Route path="/calc/opposite" element={<OppositeColor />} />

                {/* 查询工具子页 */}
                <Route path="/query/convert" element={<ColorConverter />} />
                <Route path="/query/picker" element={<ColorPickerModule />} />
                <Route path="/query/gradients" element={<GradientCollection />} />
                <Route path="/query/websafe" element={<WebSafeColors />} />
                <Route path="/query/rgb-reference" element={<RGBReferenceTable />} />
                <Route path="/query/cmyk-reference" element={<CMYKReferenceTable />} />
                
                {/* 404 Catch-all */}
                <Route path="*" element={<div className="p-8 text-center text-slate-600 font-bold">页面开发中... (404)</div>} />
              </Routes>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
      <Toast />
    </div>
  );
};

export default App;
