/**
 * 功能：应用首页 - 功能介绍与广告预留
 * 作者：FullStack-Guardian
 * 更新时间：2026-01-04
 */
import React from 'react';
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

const features = [
  {
    title: '传统色彩库',
    desc: '收录中日传统色系，探索东方美学之源。',
    icon: Palette,
    color: 'bg-rose-500',
    path: '/traditional',
  },
  {
    title: '精准拾色',
    desc: '支持图片取色与屏幕取色，捕获每一抹灵感。',
    icon: Pipette,
    color: 'bg-blue-500',
    path: '/picker',
  },
  {
    title: '专业计算',
    desc: '对比度检查、灰度转换与颜色混合处理。',
    icon: Calculator,
    color: 'bg-amber-500',
    path: '/calc',
  },
  {
    title: '快捷查询',
    desc: '多格式转换、Web安全色与渐变色灵感。',
    icon: Search,
    color: 'bg-indigo-500',
    path: '/query',
  }
];

const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loadingPath, setLoadingPath] = React.useState<string | null>(null);

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
    <PageContainer title="首页" showBack={false} hideDefaultTitle compact>
      <div className="max-w-6xl mx-auto h-full flex flex-col justify-between py-2 space-y-4">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-6 shrink-0">
          <div className="max-w-3xl space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mx-auto"
            >
              <Sparkles size={14} />
              <span>专业的色彩设计助手</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 leading-tight">
                色彩工坊
              </span>
              <span className="text-xl md:text-2xl font-bold text-slate-500 tracking-[0.2em]">
                探索色彩的无限可能
              </span>
            </motion.h1>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-violet-50/50 rounded-full blur-3xl -z-10" />
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
              className={`bg-white p-6 xl:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden active:scale-95 h-full flex flex-col justify-center ${
                loadingPath === f.path ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
              }`}
            >
              {/* 加载状态覆盖层 */}
              {loadingPath === f.path && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-current/10 group-hover:scale-110 transition-transform shrink-0`}>
                <f.icon size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Advantage Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
          <div className="flex items-center gap-3 p-3 bg-white/40 rounded-2xl border border-slate-50 shadow-sm">
            <div className="shrink-0 w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm leading-tight">极速响应</h4>
              <p className="text-sm text-slate-600 mt-0.5">所有计算均在本地完成。</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/40 rounded-2xl border border-slate-50 shadow-sm">
            <div className="shrink-0 w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm leading-tight">隐私安全</h4>
              <p className="text-sm text-slate-600 mt-0.5">本地处理，保护您的资产。</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/40 rounded-2xl border border-slate-50 shadow-sm">
            <div className="shrink-0 w-9 h-9 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm leading-tight">无缝体验</h4>
              <p className="text-sm text-slate-600 mt-0.5">精心设计的 UI 操作流畅。</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="flex items-center justify-center py-2 gap-2 shrink-0 border-t border-slate-100 pt-4">
          <p className="text-sm font-black text-slate-600 tracking-widest">色彩工坊 | 鲲穹AI旗下工具</p>
          <img src={kqIco} alt="KQ Logo" className="w-5 h-5 object-contain" />
        </div>
      </div>
    </PageContainer>
  );
};

export default HomeDashboard;
