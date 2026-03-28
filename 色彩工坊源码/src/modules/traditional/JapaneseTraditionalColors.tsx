/**
 * 功能：日本传统色彩子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import { motion } from 'framer-motion';
import PageContainer from '../../components/PageContainer';
import colorData from '../../data/colors.json';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

interface ColorInfo {
  name: string;
  hex: string;
  romaji?: string;
}

interface CategoryInfo {
  category: string;
  colors: ColorInfo[];
}

const ColorCard: React.FC<{ color: ColorInfo }> = ({ color }) => {
  const [copied, setCopied] = React.useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const handleCopy = async () => {
    const success = await copyToClipboard(color.hex);
    if (success) {
      setCopied(true);
      addToast(`已成功复制颜色: ${color.name} (${color.hex.toUpperCase()})`);
      setTimeout(() => setCopied(false), 2000);
    } else {
      addToast('复制失败，请重试', 'error');
    }
  };

  const dark = isDark(color.hex);
  const textColor = dark ? 'text-white' : 'text-black';
  const subTextColor = dark ? 'text-white/70' : 'text-black/60';

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative h-36 rounded-xl overflow-hidden cursor-pointer shadow-md group antialiased transition-all duration-300"
      style={{ backgroundColor: color.hex }}
      onClick={handleCopy}
    >
      {/* Name and Extra Info */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="flex flex-col space-y-1">
          <span className={`text-xl font-black tracking-tight leading-tight ${textColor}`}>
            {color.name}
          </span>
          {color.romaji && (
            <span className={`text-sm italic font-medium leading-relaxed opacity-80 ${textColor}`}>
              {color.romaji}
            </span>
          )}
        </div>
      </div>

      {/* Bottom bar with Hex code */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/10 backdrop-blur-md flex items-center px-4 border-t border-white/10">
        <span className={`text-xs font-mono font-bold uppercase tracking-wider ${subTextColor}`}>
          {color.hex}
        </span>
      </div>

      {/* Copy Indicator */}
      {copied && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[2px]">
          <div className="bg-white/90 text-black px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transform scale-110 transition-transform">
            已复制
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Helper to determine text color using relative luminance for better accessibility
const isDark = (hex: string) => {
  const rgb = hex.startsWith('#') ? hex.slice(1) : hex;
  const r = parseInt(rgb.slice(0, 2), 16) / 255;
  const g = parseInt(rgb.slice(2, 4), 16) / 255;
  const b = parseInt(rgb.slice(4, 6), 16) / 255;

  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  const luminance = a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  return luminance < 0.179;
};

const JapaneseTraditionalColors: React.FC = () => {
  // 处理数据结构：如果 japan 是扁平数组，则包装进默认分类；如果是分类数组则直接使用
  const rawJapanData = (colorData.japan || []) as any[];
  const isCategorized = rawJapanData.length > 0 && 'category' in rawJapanData[0];
  
  const japanData: CategoryInfo[] = isCategorized 
    ? (rawJapanData as CategoryInfo[])
    : [{ category: '和色大观', colors: rawJapanData as ColorInfo[] }];

  return (
    <PageContainer title="日本传统色彩" hideDefaultTitle>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 border-2 border-white/50">
              <span className="text-2xl">👘</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">日本传统色彩 (和色)</h1>
          </div>
        </div>

        {japanData.map((category, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-500 flex items-center gap-2 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                {category.category}
              </h2>
              <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                {category.colors.length} COLORS
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {category.colors.map((color, cIdx) => (
                <ColorCard key={`${category.category}-${color.hex}-${cIdx}`} color={color} />
              ))}
            </div>
          </div>
        ))}

        <div className="bg-indigo-50/50 p-8 rounded-xl border border-indigo-100 space-y-4">
          <h3 className="text-indigo-600 font-bold text-lg">关于日本传统色 (Nippon Colors):</h3>
          <div className="space-y-3 text-indigo-500/90 text-sm leading-relaxed">
            <p>1、日本传统色是指在日本绘画、染色、织造等传统艺术和工艺中长期使用的颜色。</p>
            <p>2、这些颜色的命名通常源自自然界（花、鸟、风、月）以及日常生活中的物品：</p>
            <div className="space-y-1 pl-4">
              <p>(1)、樱色 (Sakura-iro)：象征着春天的樱花，是日本美学的核心。</p>
              <p>(2)、茜色 (Akane-iro)：古老的红色染料，常用于描述夕阳的颜色。</p>
              <p>(3)、瑠璃色 (Ruri-iro)：深邃的蓝色，象征着宝石和天空。</p>
              <p>(4)、抹茶色 (Matcha-iro)：典型的日本茶道色彩，体现了“侘寂”之美。</p>
            </div>
            <p>3、日本传统色不仅是视觉的享受，更承载着大和民族对四季流转的细腻情感。每一道色彩背后，都有一段关于季节、文学或历史的动人故事。</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default JapaneseTraditionalColors;
