/**
 * 功能：带有返回功能的页面容器
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
  hideDefaultTitle?: boolean;
  compact?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  title, 
  showBack = true,
  hideDefaultTitle = false,
  compact = false
}) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative h-full"
    >
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="absolute -top-10 left-0 z-[100] p-2.5 bg-white/90 backdrop-blur-md shadow-sm hover:shadow-md hover:bg-white rounded-xl transition-all duration-300 text-slate-600 active:scale-90 group"
          title="返回"
        >
          <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      )}

      <div className={`${compact ? 'space-y-3' : 'space-y-6'} pt-2 h-full flex flex-col`}>
        {!hideDefaultTitle && (
          <header className="flex items-center justify-between mb-8 pl-16 shrink-0">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{title}</h1>
          </header>
        )}
        
        <div className="flex-1 min-h-0">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default PageContainer;
