/**
 * 功能：中国传统色彩子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [copied, setCopied] = React.useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const handleCopy = async () => {
    const success = await copyToClipboard(color.hex);
    if (success) {
      setCopied(true);
      addToast(t('toast.copySuccessColor', { value: `${color.name} (${color.hex.toUpperCase()})` }));
      setTimeout(() => setCopied(false), 2000);
    } else {
      addToast(t('toast.copyFailRetry'), 'error');
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
            {t('common.copied')}
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
  const { t } = useTranslation();
  const chinaData = (colorData.china || []) as unknown as CategoryInfo[];

  return (
    <PageContainer title={t('traditional.china')} hideDefaultTitle>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-100 dark:shadow-pink-900/30 border-2 border-white/50 dark:border-slate-600/50">
              <span className="text-2xl">🎨</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{t('traditional.china')}</h1>
          </div>
        </div>

        {/* Color Categories */}
        {chinaData.map((category, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                {category.category}
              </h2>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                {t('common.colorsCount', { count: category.colors.length })}
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
        <div className="bg-orange-50/50 dark:bg-orange-900/20 p-8 rounded-xl border border-orange-100 dark:border-orange-800/50 space-y-4">
          <h3 className="text-orange-600 dark:text-orange-400 font-bold text-lg">{t('traditional.chinaAboutTitle')}</h3>
          <div className="space-y-3 text-orange-500/90 dark:text-orange-200/90 text-sm leading-relaxed">
            <p>{t('traditional.chinaAbout1')}</p>
            <p>{t('traditional.chinaAbout2')}</p>
            <div className="space-y-1 pl-4">
              <p>{t('traditional.chinaAboutItem1')}</p>
              <p>{t('traditional.chinaAboutItem2')}</p>
              <p>{t('traditional.chinaAboutItem3')}</p>
              <p>{t('traditional.chinaAboutItem4')}</p>
              <p>{t('traditional.chinaAboutItem5')}</p>
              <p>{t('traditional.chinaAboutItem6')}</p>
              <p>{t('traditional.chinaAboutItem7')}</p>
              <p>{t('traditional.chinaAboutItem8')}</p>
              <p>{t('traditional.chinaAboutItem9')}</p>
            </div>
            <p>{t('traditional.chinaAbout3')}</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ChineseTraditionalColors;
