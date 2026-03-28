/**
 * 功能：主应用入口与路由配置
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
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
import ColorBlindSimulator from './modules/calc/ColorBlindSimulator';

// 查询工具子页
import ColorConverter from './modules/query/ColorConverter';
import ColorPickerModule from './modules/query/ColorPickerModule';
import GradientCollection from './modules/query/GradientCollection';
import WebSafeColors from './modules/query/WebSafeColors';
import RGBReferenceTable from './modules/query/RGBReferenceTable';
import CMYKReferenceTable from './modules/query/CMYKReferenceTable';
import PaletteManager from './modules/query/PaletteManager';

import Toast from './components/Toast';
import logoIcon from '/d897a4570f2f9ae44ece196d7a181b71.png';
import kqIcon from '/kq-55_256x256.ico';
import { Keyboard, X, Sun, Moon, Monitor } from 'lucide-react';
import UserAuth from './components/UserAuth';
import AdBanner from './components/AdBanner';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useThemeStore, getEffectiveTheme, type ThemeMode } from './store/themeStore';

// WindowControls 组件不再需要，改用系统原生标题栏
// import WindowControls from './components/WindowControls';

const App: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isAtMinSize, setIsAtMinSize] = React.useState({ width: false, height: false });
  const [shortcutHelpOpen, setShortcutHelpOpen] = React.useState(false);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  // 根据主题与系统偏好，给 document 根添加/移除 dark 类
  React.useEffect(() => {
    const apply = () => {
      const effective = getEffectiveTheme();
      if (effective === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    apply();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);

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

  // 全局快捷键：主进程通过 navigate-to 下发路由，此处跳转
  React.useEffect(() => {
    const ipc = (window as any).require?.('electron')?.ipcRenderer;
    if (!ipc) return;
    const handler = (_e: unknown, pathTo: string) => {
      if (pathTo && typeof pathTo === 'string') navigate(pathTo);
    };
    ipc.on('navigate-to', handler);
    return () => {
      ipc.removeListener('navigate-to', handler);
    };
  }, [navigate]);

  const tabs = [
    { id: 'home', name: t('nav.home'), path: '/home', icon: Home },
    { id: 'calc', name: t('nav.calc'), path: '/calc', icon: Calculator },
    { id: 'query', name: t('nav.query'), path: '/query', icon: Search },
    { id: 'traditional', name: t('nav.traditional'), path: '/traditional', icon: Palette },
    { id: 'picker', name: t('nav.picker'), path: '/picker', icon: Pipette },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden transition-all duration-300 relative ${
      (isAtMinSize.width || isAtMinSize.height) ? 'ring-4 ring-inset ring-indigo-500/20' : ''
    }`}>
      {/* 移除自定义窗口控制条，使用系统原生标题栏 */}
      {/* <div className="absolute top-0 right-0 h-10 z-[9999] flex window-no-drag">
        <WindowControls />
      </div> */}

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col z-20 shadow-xl">
        <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30 overflow-hidden">
            <img src={logoIcon} alt="Logo" className="w-full h-full object-cover p-1" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-800 dark:text-slate-100 leading-none mb-1">色彩工坊</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em] leading-none">Color Tools</p>
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
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30 font-bold translate-x-1'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon size={22} className={active ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'} />
                  <span className="text-base">{tab.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Ad + 底部按钮区：整体缩小，让上方主导航区域更大 */}
          <div className="px-3 pb-3 mt-auto shrink-0 border-t border-slate-50 dark:border-slate-700 pt-2 space-y-2">
            {/* 主题切换 */}
            <div className="flex items-center gap-1 p-1.5 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
              {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => {
                const isActive = theme === mode;
                const Icon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;
                const label = mode === 'light' ? t('theme.light') : mode === 'dark' ? t('theme.dark') : t('theme.system');
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTheme(mode)}
                    title={label}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      isActive
                        ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
            <div className="w-[85%] mx-auto">
              <AdBanner position="adv_position_04" aspectRatio="2/3" className="w-full shadow-lg" />
            </div>

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
              className="w-full py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-black text-xs shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 group"
            >
              <img src={kqIcon} alt="KQ" className="w-3.5 h-3.5 rounded-sm" />
              <span className="tracking-widest">{t('sidebar.customSoftware')}</span>
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* Problem Feedback Button */}
            <button 
              onClick={async () => {
                try {
                  const { shell } = (window as any).require ? (window as any).require('electron') : { shell: null };
                  const axios = (await import('axios')).default;
                  const response = await axios.post('https://api-web.kunqiongai.com/soft_desktop/get_feedback_url');
                  if (response.data.code === 1 && response.data.data.url) {
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
              className="w-full py-2 bg-white dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-xs shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600/50 hover:border-slate-300 dark:hover:border-slate-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 group"
            >
              <MessageSquare size={16} className="text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="tracking-tight">{t('sidebar.feedback')}</span>
            </button>

            {/* Shortcut Help Button */}
            <button
              type="button"
              onClick={() => setShortcutHelpOpen(true)}
              className="w-full py-2 bg-white dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-xs shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600/50 hover:border-slate-300 dark:hover:border-slate-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 group"
            >
              <Keyboard size={16} className="text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="tracking-tight">{t('sidebar.shortcutHelp')}</span>
            </button>

          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Header with User Auth */}
        <header className="h-20 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between pl-10 pr-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md z-[101] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-sm font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.2em]">
              {tabs.find(tab => isActive(tab.path))?.name || t('nav.home')}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
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
            className="flex-1 overflow-auto p-6 md:p-10 flex flex-col bg-slate-50/50 dark:bg-slate-900/50"
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
                <Route path="/calc/colorblind" element={<ColorBlindSimulator />} />

                {/* 查询工具子页 */}
                <Route path="/query/convert" element={<ColorConverter />} />
                <Route path="/query/picker" element={<ColorPickerModule />} />
                <Route path="/query/gradients" element={<GradientCollection />} />
                <Route path="/query/websafe" element={<WebSafeColors />} />
                <Route path="/query/rgb-reference" element={<RGBReferenceTable />} />
                <Route path="/query/cmyk-reference" element={<CMYKReferenceTable />} />
                <Route path="/query/palettes" element={<PaletteManager />} />

                {/* 404 Catch-all */}
                <Route path="*" element={<div className="p-8 text-center text-slate-600 dark:text-slate-400 font-bold">{t('app.pageNotFound')}</div>} />
              </Routes>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
      <Toast />

      {/* 快捷键说明弹窗 */}
      <AnimatePresence>
        {shortcutHelpOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/50 backdrop-blur-sm z-[200]"
              onClick={() => setShortcutHelpOpen(false)}
            />
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="shortcut-help-title"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md pointer-events-auto"
              >
                <div
                  className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-600 shadow-xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 id="shortcut-help-title" className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Keyboard size={22} className="text-indigo-600 dark:text-indigo-400" />
                    {t('shortcut.title')}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShortcutHelpOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-xl transition-colors"
                    aria-label={t('common.close')}
                  >
                    <X size={18} />
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{t('shortcut.hint')}</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-600">
                      <th className="text-left py-2 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('shortcut.shortcutCol')}</th>
                      <th className="text-left py-2 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('shortcut.actionCol')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    <tr className="border-b border-slate-50 dark:border-slate-600">
                      <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">Ctrl + Shift + C</td>
                      <td className="py-3">{t('shortcut.screenPick')}</td>
                    </tr>
                    <tr className="border-b border-slate-50 dark:border-slate-600">
                      <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">Ctrl + Shift + R</td>
                      <td className="py-3">{t('shortcut.colorblind')}</td>
                    </tr>
                    <tr className="border-b border-slate-50 dark:border-slate-600">
                      <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">Ctrl + Shift + P</td>
                      <td className="py-3">{t('shortcut.palette')}</td>
                    </tr>
                    <tr className="border-b border-slate-50 dark:border-slate-600">
                      <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">Ctrl + Shift + Q</td>
                      <td className="py-3">{t('shortcut.showHide')}</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
