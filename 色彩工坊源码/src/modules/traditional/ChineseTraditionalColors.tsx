/**
 * 功能：中国传统色彩子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import PageContainer from '../../components/PageContainer';
import colorData from '../../data/colors.json';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

interface ColorInfo {
  name: string;
  hex: string;
  pinyin?: string;
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
          {color.pinyin && (
            <span className={`text-sm italic font-medium leading-relaxed opacity-80 ${textColor}`}>
              {color.pinyin}
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

const ChineseTraditionalColors: React.FC = () => {
  const chinaData = (colorData.china || []) as unknown as CategoryInfo[];

  return (
    <PageContainer title="中国传统色彩" hideDefaultTitle>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-100 border-2 border-white/50">
              <span className="text-2xl">🎨</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">中国传统色彩</h1>
          </div>
        </div>

        {/* Color Categories */}
        {chinaData.map((category, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-500 flex items-center gap-2 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                {category.category}
              </h2>
              <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                {category.colors.length} COLORS
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {category.colors.map((color, cIdx) => (
                <ColorCard key={`${category.category}-${color.name}-${color.hex}-${cIdx}`} color={color} />
              ))}
            </div>
          </div>
        ))}

        {/* About Section */}
        <div className="bg-orange-50/50 p-8 rounded-xl border border-orange-100 space-y-4">
          <h3 className="text-orange-600 font-bold text-lg">关于中国传统色介绍:</h3>
          <div className="space-y-3 text-orange-500/90 text-sm leading-relaxed">
            <p>1、中国的传统色彩文化丰富多彩，具有深厚的文化底蕴和历史传承。</p>
            <p>2、以下是一些中国传统文化中常见的颜色及其象征意义：</p>
            <div className="space-y-1 pl-4">
              <p>(1)、红色：在中国文化中，红色是最受欢迎和最具代表性的颜色之一，象征着喜庆、幸运、热情和繁荣。在传统节日和重要场合，红色经常被使用。</p>
              <p>(2)、黄色：黄色在中国古代是皇家的专用色，象征着权威、尊贵和财富。</p>
              <p>(3)、蓝色：在中国，蓝色有时与长寿和永恒相关联，也是天空和宁静的象征。</p>
              <p>(4)、绿色：绿色通常与春季、新生和希望联系在一起，也代表着生长和生命力。</p>
              <p>(5)、黑色：黑色在中国文化中有时与水分、北方和寒冷相关联，也有时用于表达严肃和正式。</p>
              <p>(6)、白色：白色通常与纯洁、清白和丧事联系在一起。在古代，白色也用于表达对死者的哀悼。</p>
              <p>(7)、紫色：紫色在中国文化中象征着高贵和高雅，有时也与神秘和神圣相关。</p>
              <p>(8)、金色：金色代表着财富、繁荣和地位，常用于装饰，以显示富丽堂皇。</p>
              <p>(9)、银色：银色与金色相似，也象征着财富，但通常更为柔和和内敛。</p>
            </div>
            <p>3、中国的传统色彩不仅体现在绘画、建筑、服饰等方面，也在诗词、文学和日常生活中有着广泛的应用，是中国文化的重要组成部分。</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ChineseTraditionalColors;
