/**
 * 功能：应用首页 - 功能介绍与广告预留
 * 作者：FullStack-Guardian
 * 更新时间：2026-01-04
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../components/PageContainer';
import { 
  Palette, 
  Pipette, 
  Calculator, 
  Search, 
  Zap, 
  ShieldCheck, 
  Layout, 
  Sparkles 
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
import logoIcon from '/d897a4570f2f9ae44ece196d7a181b71.png';
import kqIco from '/kq-55_256x256.ico';


const HomeDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loadingPath, setLoadingPath] = React.useState<string | null>(null);

  const features = [
    { titleKey: 'home.featureTraditional', descKey: 'home.featureTraditionalDesc', icon: Palette, color: 'bg-rose-500', path: '/traditional' },
    { titleKey: 'home.featurePicker', descKey: 'home.featurePickerDesc', icon: Pipette, color: 'bg-blue-500', path: '/picker' },
    { titleKey: 'home.featureCalc', descKey: 'home.featureCalcDesc', icon: Calculator, color: 'bg-amber-500', path: '/calc' },
    { titleKey: 'home.featureQuery', descKey: 'home.featureQueryDesc', icon: Search, color: 'bg-indigo-500', path: '/query' },
  ];

  const handleFeatureClick = async (path: string) => {
    // 1. 跳转前验证逻辑 (此处示例：检查路径是否存在)
    if (!path) return;

    // 2. 显示加载状态
    setLoadingPath(path);

    try {
      // 模拟一个极短的加载延迟，以增强跳转感并处理“平滑”要求
      // 在实际路由跳转中，react-router-dom 是瞬时的
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 3. 执行路由跳转
      navigate(path);
    } catch (error) {
      console.error('跳转失败:', error);
      // 处理可能的失败情况
    } finally {
      // 如果跳转未发生（例如在当前页），清除加载状态
      setLoadingPath(null);
    }
  };

  return (
    <PageContainer title={t('home.title')} showBack={false} hideDefaultTitle compact>
      <div className="max-w-6xl mx-auto h-full flex flex-col justify-between py-2 space-y-4">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-600 shadow-sm flex flex-col items-center text-center space-y-6 shrink-0">
          <div className="max-w-3xl space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-full text-sm font-bold mx-auto"
            >
              <Sparkles size={14} />
              <span>{t('home.badge')}</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 leading-tight">
                {t('home.brand')}
              </span>
              <span className="text-xl md:text-2xl font-bold text-slate-500 dark:text-slate-400 tracking-[0.2em]">
                {t('home.slogan')}
              </span>
            </motion.h1>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-violet-50/50 dark:bg-violet-900/20 rounded-full blur-3xl -z-10" />
        </section>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 min-h-0 items-center">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              onClick={() => handleFeatureClick(f.path)}
              className={`bg-white dark:bg-slate-800 p-6 xl:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-600 shadow-sm hover:shadow-md dark:hover:shadow-slate-900/50 transition-all group cursor-pointer relative overflow-hidden active:scale-95 h-full flex flex-col justify-center ${
                loadingPath === f.path ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900' : ''
              }`}
            >
              {loadingPath === f.path && (
                <div className="absolute inset-0 bg-white/60 dark:bg-slate-800/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-current/10 group-hover:scale-110 transition-transform shrink-0`}>
                <f.icon size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">{t(f.titleKey)}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{t(f.descKey)}</p>
            </motion.div>
          ))}
        </div>

        {/* Advantage Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
          <div className="flex items-center gap-3 p-3 bg-white/40 dark:bg-slate-800/60 rounded-2xl border border-slate-50 dark:border-slate-600 shadow-sm">
            <div className="shrink-0 w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">{t('home.advantageFast')}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{t('home.advantageFastDesc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/40 dark:bg-slate-800/60 rounded-2xl border border-slate-50 dark:border-slate-600 shadow-sm">
            <div className="shrink-0 w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">{t('home.advantageSafe')}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{t('home.advantageSafeDesc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/40 dark:bg-slate-800/60 rounded-2xl border border-slate-50 dark:border-slate-600 shadow-sm">
            <div className="shrink-0 w-9 h-9 rounded-full bg-violet-50 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">{t('home.advantageSmooth')}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{t('home.advantageSmoothDesc')}</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="flex items-center justify-center py-2 gap-2 shrink-0 border-t border-slate-100 dark:border-slate-700 pt-4">
          <p className="text-sm font-black text-slate-600 dark:text-slate-400 tracking-widest">{t('home.footer')}</p>
          <img src={kqIco} alt="KQ Logo" className="w-5 h-5 object-contain" />
        </div>
      </div>
    </PageContainer>
  );
};

export default HomeDashboard;
