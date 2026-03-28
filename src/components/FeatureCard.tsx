/**
 * 功能：统一的功能入口卡片组件
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeatureCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon, path, color = 'indigo' }) => {
  const navigate = useNavigate();

  const colorClasses: Record<string, string> = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 group-hover:bg-indigo-600',
    red: 'bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-300 group-hover:bg-red-600',
    pink: 'bg-pink-50 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 group-hover:bg-pink-600',
    orange: 'bg-orange-50 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300 group-hover:bg-orange-600',
    blue: 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 group-hover:bg-blue-600',
    green: 'bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-300 group-hover:bg-green-600',
    purple: 'bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 group-hover:bg-purple-600',
  };

  const activeClasses = colorClasses[color] || colorClasses.indigo;

  return (
    <motion.button
      whileHover={{ scale: 1.01, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(path)}
      className="flex flex-col items-start p-8 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-600 shadow-sm hover:shadow-2xl dark:hover:shadow-slate-900/50 hover:border-indigo-100 dark:hover:border-indigo-500/50 transition-all text-left w-full group relative overflow-hidden min-h-[220px]"
    >
      <div className={`p-4 rounded-2xl ${activeClasses} group-hover:text-white transition-colors mb-6`}>
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">{title}</h3>
      <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </motion.button>
  );
};

export default FeatureCard;
