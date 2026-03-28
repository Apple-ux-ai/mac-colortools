/**
 * 功能：CMYK 颜色对照表子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/PageContainer';
import { colord, extend } from 'colord';
import cmykPlugin from 'colord/plugins/cmyk';
import { ChevronLeft, ChevronRight, Info, Copy } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

extend([cmykPlugin]);

const ITEMS_PER_PAGE = 15;

const referenceColors = [
  // 1-15: 红色系列
  { hex: '#FF0000' }, { hex: '#E60012' }, { hex: '#D7000F' }, { hex: '#C4000B' }, { hex: '#B10008' },
  { hex: '#9E0005' }, { hex: '#8B0002' }, { hex: '#780000' }, { hex: '#FF3333' }, { hex: '#FF6666' },
  { hex: '#FF9999' }, { hex: '#FFCCCC' }, { hex: '#800000' }, { hex: '#A52A2A' }, { hex: '#B22222' },
  // 16-30: 橙色系列
  { hex: '#F39800' }, { hex: '#EA5506' }, { hex: '#F15A24' }, { hex: '#F7931E' }, { hex: '#FBB03B' },
  { hex: '#FF8C00' }, { hex: '#FFA500' }, { hex: '#FF7F50' }, { hex: '#FF6347' }, { hex: '#FF4500' },
  { hex: '#D2691E' }, { hex: '#B8860B' }, { hex: '#CD853F' }, { hex: '#E9967A' }, { hex: '#FFD700' },
  // 31-45: 黄色系列
  { hex: '#FFF100' }, { hex: '#FFFF00' }, { hex: '#FCEE21' }, { hex: '#D9E021' }, { hex: '#FFFFE0' },
  { hex: '#FFFACD' }, { hex: '#FAFAD2' }, { hex: '#FFEFD5' }, { hex: '#FFE4B5' }, { hex: '#FFDAB9' },
  { hex: '#EEE8AA' }, { hex: '#F0E68C' }, { hex: '#BDB76B' }, { hex: '#FFF8DC' }, { hex: '#FFEBCD' },
  // 46-60: 绿色系列
  { hex: '#009944' }, { hex: '#00A95F' }, { hex: '#007130' }, { hex: '#8CC63F' }, { hex: '#32CD32' },
  { hex: '#228B22' }, { hex: '#008000' }, { hex: '#006400' }, { hex: '#9ACD32' }, { hex: '#6B8E23' },
  { hex: '#556B2F' }, { hex: '#ADFF2F' }, { hex: '#7FFF00' }, { hex: '#7CFC00' }, { hex: '#00FF00' },
  // 61-75: 青色/蓝色系列
  { hex: '#00A0E9' }, { hex: '#00ADA9' }, { hex: '#009E9F' }, { hex: '#0068B7' }, { hex: '#00479D' },
  { hex: '#1D2088' }, { hex: '#2E3192' }, { hex: '#0000FF' }, { hex: '#0000CD' }, { hex: '#00008B' },
  { hex: '#000080' }, { hex: '#191970' }, { hex: '#4169E1' }, { hex: '#6495ED' }, { hex: '#1E90FF' },
  // 76-90: 品红/紫色系列
  { hex: '#E4007F' }, { hex: '#E5004F' }, { hex: '#920783' }, { hex: '#601986' }, { hex: '#FF00FF' },
  { hex: '#EE82EE' }, { hex: '#DA70D6' }, { hex: '#BA55D3' }, { hex: '#9932CC' }, { hex: '#9400D3' },
  { hex: '#8A2BE2' }, { hex: '#8B008B' }, { hex: '#800080' }, { hex: '#4B0082' }, { hex: '#6A5ACD' },
  // 91-106: 效果图指定系列 (紫色与灰黑)
  { hex: '#8F006D' }, { hex: '#A2007C' }, { hex: '#AF4A92' }, { hex: '#C57CAC' }, { hex: '#D2A6C7' },
  { hex: '#E8D3E3' }, { hex: '#ECECEC' }, { hex: '#D7D7D7' }, { hex: '#C2C2C2' }, { hex: '#B7B7B7' },
  { hex: '#A0A0A0' }, { hex: '#898989' }, { hex: '#707070' }, { hex: '#555555' }, { hex: '#363636' },
  { hex: '#000000' },
];

const CMYKReferenceTable: React.FC = () => {
  const { t } = useTranslation();
  const addToast = useToastStore((state) => state.addToast);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(referenceColors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedColors = referenceColors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <PageContainer title={t('queryCmyk.title')}>
      <div className="bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-600 shadow-sm overflow-hidden max-w-[1400px] mx-auto">
        {/* Title Header */}
        <div className="py-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-600 flex items-center justify-center">
          <span className="text-slate-600 dark:text-slate-300 font-bold text-sm tracking-widest">{t('queryCmyk.title')}</span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600 w-16">{t('queryCmyk.number')}</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600">C</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600">M</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600">Y</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600">K</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600">R</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600">G</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-600">B</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400">{t('queryCmyk.hexValue')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-600">
              {paginatedColors.map((color, index) => {
                const c = colord(color.hex);
                const rgb = c.toRgb();
                const cmyk = c.toCmyk();
                const displayIndex = startIndex + index + 1;

                return (
                  <tr key={`${color.hex}-${displayIndex}`} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 border-r border-slate-100 dark:border-slate-600">
                      <div 
                        className="w-full py-1.5 rounded-sm text-white text-xs font-bold shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      >
                        {displayIndex}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-300 text-sm border-r border-slate-100 dark:border-slate-600 font-medium">{cmyk.c}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-300 text-sm border-r border-slate-100 dark:border-slate-600 font-medium">{cmyk.m}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-300 text-sm border-r border-slate-100 dark:border-slate-600 font-medium">{cmyk.y}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-300 text-sm border-r border-slate-100 dark:border-slate-600 font-medium">{cmyk.k}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-300 text-sm border-r border-slate-100 dark:border-slate-600 font-medium">{rgb.r}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-300 text-sm border-r border-slate-100 dark:border-slate-600 font-medium">{rgb.g}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-300 text-sm border-r border-slate-100 dark:border-slate-600 font-medium">{rgb.b}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={async () => {
                            const success = await copyToClipboard(color.hex);
                            if (success) {
                              addToast(t('toast.copySuccessPlain', { value: color.hex.toUpperCase() }));
                            } else {
                              addToast(t('toast.copyFailRetry'), 'error');
                            }
                          }}
                        className="font-mono text-xs uppercase text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-1 mx-auto"
                      >
                        {color.hex}
                        <Copy size={10} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-8 py-4 border-t border-slate-100 dark:border-slate-600 flex items-center justify-start gap-2 bg-white dark:bg-slate-800">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 disabled:opacity-20 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-sm text-xs font-bold transition-all ${
                    currentPage === i + 1 
                      ? 'bg-blue-500 text-white' 
                      : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 disabled:opacity-20 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 max-w-[1400px] mx-auto bg-amber-50/50 dark:bg-amber-900/20 p-8 rounded-xl border border-amber-100 dark:border-amber-800/50 space-y-4">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-lg">
          <Info size={20} />
          <h3>{t('queryCmyk.aboutTitle')}</h3>
        </div>
        <div className="space-y-3 text-amber-800/80 dark:text-amber-200/90 text-sm leading-relaxed font-medium">
          <p>{t('queryCmyk.about1')}</p>
          <p>{t('queryCmyk.about2')}</p>
          <p>{t('queryCmyk.about3')}</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default CMYKReferenceTable;
