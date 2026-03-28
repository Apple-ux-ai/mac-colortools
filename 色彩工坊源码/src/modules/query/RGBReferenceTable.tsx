/**
 * 功能：RGB 颜色对照表子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState, useMemo } from 'react';
import PageContainer from '../../components/PageContainer';
import { colord } from 'colord';
import { Search, Share2, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

const ITEMS_PER_PAGE = 15;

const referenceColors = [
  // 白色系
  { name: 'Snow', hex: '#FFFAFA' },
  { name: 'GhostWhite', hex: '#F8F8FF' },
  { name: 'WhiteSmoke', hex: '#F5F5F5' },
  { name: 'Gainsboro', hex: '#DCDCDC' },
  { name: 'FloralWhite', hex: '#FFFAF0' },
  { name: 'OldLace', hex: '#FDF5E6' },
  { name: 'Linen', hex: '#FAF0E6' },
  { name: 'AntiqueWhite', hex: '#FAEBD7' },
  { name: 'PapayaWhip', hex: '#FFEFD5' },
  { name: 'BlanchedAlmond', hex: '#FFEBCD' },
  { name: 'Bisque', hex: '#FFE4C4' },
  { name: 'PeachPuff', hex: '#FFDAB9' },
  { name: 'NavajoWhite', hex: '#FFDEAD' },
  { name: 'Moccasin', hex: '#FFE4B5' },
  // 灰色系
  { name: 'LightGray', hex: '#D3D3D3' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'DarkGray', hex: '#A9A9A9' },
  { name: 'Gray', hex: '#808080' },
  { name: 'DimGray', hex: '#696969' },
  { name: 'LightSlateGray', hex: '#778899' },
  { name: 'SlateGray', hex: '#708090' },
  { name: 'DarkSlateGray', hex: '#2F4F4F' },
  { name: 'Black', hex: '#000000' },
  // 红色系
  { name: 'LightCoral', hex: '#F08080' },
  { name: 'Salmon', hex: '#FA8072' },
  { name: 'DarkSalmon', hex: '#E9967A' },
  { name: 'LightSalmon', hex: '#FFA07A' },
  { name: 'Crimson', hex: '#DC143C' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'FireBrick', hex: '#B22222' },
  { name: 'DarkRed', hex: '#8B0000' },
  // 粉色系
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'LightPink', hex: '#FFB6C1' },
  { name: 'HotPink', hex: '#FF69B4' },
  { name: 'DeepPink', hex: '#FF1493' },
  { name: 'MediumVioletRed', hex: '#C71585' },
  { name: 'PaleVioletRed', hex: '#DB7093' },
  // 橙色系
  { name: 'Tomato', hex: '#FF6347' },
  { name: 'OrangeRed', hex: '#FF4500' },
  { name: 'DarkOrange', hex: '#FF8C00' },
  { name: 'Orange', hex: '#FFA500' },
  // 黄色系
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'LightYellow', hex: '#FFFFE0' },
  { name: 'LemonChiffon', hex: '#FFFACD' },
  { name: 'LightGoldenrodYellow', hex: '#FAFAD2' },
  { name: 'Cornsilk', hex: '#FFF8DC' },
  // 紫色系
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Thistle', hex: '#D8BFD8' },
  { name: 'Plum', hex: '#DDA0DD' },
  { name: 'Violet', hex: '#EE82EE' },
  { name: 'Orchid', hex: '#DA70D6' },
  { name: 'Fuchsia', hex: '#FF00FF' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'MediumOrchid', hex: '#BA55D3' },
  { name: 'MediumPurple', hex: '#9370DB' },
  { name: 'BlueViolet', hex: '#8A2BE2' },
  { name: 'DarkViolet', hex: '#9400D3' },
  { name: 'DarkOrchid', hex: '#9932CC' },
  { name: 'DarkMagenta', hex: '#8B008B' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Indigo', hex: '#4B0082' },
  { name: 'SlateBlue', hex: '#6A5ACD' },
  { name: 'DarkSlateBlue', hex: '#483D8B' },
  // 绿色系
  { name: 'GreenYellow', hex: '#ADFF2F' },
  { name: 'Chartreuse', hex: '#7FFF00' },
  { name: 'LawnGreen', hex: '#7CFC00' },
  { name: 'Lime', hex: '#00FF00' },
  { name: 'LimeGreen', hex: '#32CD32' },
  { name: 'PaleGreen', hex: '#98FB98' },
  { name: 'LightGreen', hex: '#90EE90' },
  { name: 'MediumSpringGreen', hex: '#00FA9A' },
  { name: 'SpringGreen', hex: '#00FF7F' },
  { name: 'MediumSeaGreen', hex: '#3CB371' },
  { name: 'SeaGreen', hex: '#2E8B57' },
  { name: 'ForestGreen', hex: '#228B22' },
  { name: 'Green', hex: '#008000' },
  { name: 'DarkGreen', hex: '#006400' },
  { name: 'YellowGreen', hex: '#9ACD32' },
  { name: 'OliveDrab', hex: '#6B8E23' },
  { name: 'Olive', hex: '#808000' },
  { name: 'DarkOliveGreen', hex: '#556B2F' },
  { name: 'MediumAquamarine', hex: '#66CDAA' },
  { name: 'DarkSeaGreen', hex: '#8FBC8F' },
  { name: 'LightSeaGreen', hex: '#20B2AA' },
  { name: 'DarkCyan', hex: '#008B8B' },
  { name: 'Teal', hex: '#008080' },
  // 蓝色系
  { name: 'Aqua', hex: '#00FFFF' },
  { name: 'Cyan', hex: '#00FFFF' },
  { name: 'LightCyan', hex: '#E0FFFF' },
  { name: 'PaleTurquoise', hex: '#AFEEEE' },
  { name: 'Aquamarine', hex: '#7FFFD4' },
  { name: 'Turquoise', hex: '#40E0D0' },
  { name: 'MediumTurquoise', hex: '#48D1CC' },
  { name: 'DarkTurquoise', hex: '#00CED1' },
  { name: 'CadetBlue', hex: '#5F9EA0' },
  { name: 'SteelBlue', hex: '#4682B4' },
  { name: 'LightSteelBlue', hex: '#B0C4DE' },
  { name: 'PowderBlue', hex: '#B0E0E6' },
  { name: 'LightBlue', hex: '#ADD8E6' },
  { name: 'SkyBlue', hex: '#87CEEB' },
  { name: 'LightSkyBlue', hex: '#87CEFA' },
  { name: 'DeepSkyBlue', hex: '#00BFFF' },
  { name: 'DodgerBlue', hex: '#1E90FF' },
  { name: 'CornflowerBlue', hex: '#6495ED' },
  { name: 'MediumSlateBlue', hex: '#7B68EE' },
  { name: 'RoyalBlue', hex: '#4169E1' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'MediumBlue', hex: '#0000CD' },
  { name: 'DarkBlue', hex: '#00008B' },
  { name: 'Navy', hex: '#000080' },
  { name: 'MidnightBlue', hex: '#191970' },
  // 褐色系
  { name: 'Wheat', hex: '#F5DEB3' },
  { name: 'BurlyWood', hex: '#DEB887' },
  { name: 'Tan', hex: '#D2B48C' },
  { name: 'RosyBrown', hex: '#BC8F8F' },
  { name: 'SandyBrown', hex: '#F4A460' },
  { name: 'Goldenrod', hex: '#DAA520' },
  { name: 'DarkGoldenrod', hex: '#B8860B' },
  { name: 'Peru', hex: '#CD853F' },
  { name: 'Chocolate', hex: '#D2691E' },
  { name: 'SaddleBrown', hex: '#8B4513' },
  { name: 'Sienna', hex: '#A0522D' },
  { name: 'Brown', hex: '#A52A2A' },
  { name: 'Maroon', hex: '#800000' },
];

const RGBReferenceTable: React.FC = () => {
  const addToast = useToastStore((state) => state.addToast);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const filteredColors = useMemo(() => {
    if (!searchTerm) return referenceColors;
    return referenceColors.filter(color => 
      color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.hex.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSearch = () => {
    setSearchTerm(inputValue);
    setIsSearching(!!inputValue);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const totalPages = Math.ceil(filteredColors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedColors = filteredColors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const tableElement = document.getElementById('color-table');
      if (tableElement) {
        tableElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <PageContainer title="RGB 颜色对照表" hideDefaultTitle>
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-[1400px] mx-auto space-y-8">
          {/* Header Section */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-100 border-2 border-white/50">
                <div className="w-7 h-7 border-2 border-white rounded-md flex items-center justify-center font-bold text-xs">RGB</div>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">RGB 颜色对照表</h1>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mb-8">

          <div className="p-12 flex flex-col items-center justify-center bg-white">
            <h2 className="text-3xl font-bold text-blue-500 mb-8">颜色搜索</h2>
            <div className="relative w-full max-w-2xl flex gap-0">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="输入十六进制颜色或RGB颜色"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-l-xl focus:outline-none focus:border-blue-500 transition-all text-slate-600 placeholder:text-slate-300 shadow-sm"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="px-10 py-4 bg-blue-500 text-white font-bold rounded-r-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 active:scale-95"
              >
                查询
              </button>
            </div>

            {isSearching && searchTerm && (
              <div className="w-full max-w-2xl mt-12 space-y-8">
                {filteredColors.slice(0, 10).map((color, index) => {
                  const c = colord(color.hex);
                  const rgb = c.toRgb();
                  return (
                    <div key={`${color.hex}-${index}`} className="bg-white border border-slate-200 rounded-sm overflow-hidden">
                      <table className="w-full border-collapse">
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="w-1/4 px-6 py-4 bg-slate-50 text-slate-500 text-sm font-medium border-r border-slate-100">颜色示例</td>
                            <td className="px-6 py-4">
                              <div className="w-32 h-8 rounded-sm shadow-inner" style={{ backgroundColor: color.hex }} />
                            </td>
                          </tr>
                          <tr>
                            <td className="w-1/4 px-6 py-4 bg-slate-50 text-slate-500 text-sm font-medium border-r border-slate-100">英文名字</td>
                            <td className="px-6 py-4 text-slate-600 text-sm font-medium">{color.name}</td>
                          </tr>
                          <tr>
                            <td className="w-1/4 px-6 py-4 bg-slate-50 text-slate-500 text-sm font-medium border-r border-slate-100">RGB颜色</td>
                            <td className="px-6 py-4 text-slate-600 text-sm font-mono">{rgb.r} {rgb.g} {rgb.b}</td>
                          </tr>
                          <tr>
                            <td className="w-1/4 px-6 py-4 bg-slate-50 text-slate-500 text-sm font-medium border-r border-slate-100">十六进制</td>
                            <td className="px-6 py-4 text-slate-600 text-sm font-mono uppercase">{color.hex}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })}
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setInputValue('');
                    setIsSearching(false);
                  }}
                  className="w-full py-3 text-slate-400 text-sm hover:text-blue-500 transition-colors border border-dashed border-slate-200 rounded-lg"
                >
                  清除搜索结果，返回对照表
                </button>
              </div>
            )}
          </div>

          <div className="mx-8 mb-8 p-8 bg-orange-50/50 rounded-xl border border-orange-100">
            <h3 className="text-orange-600 font-bold text-base mb-4 flex items-center gap-2">
              关于RGB颜色与十六进制颜色介绍:
            </h3>
            <div className="space-y-2 text-orange-800/80 text-sm leading-relaxed font-medium">
              <p>1、RGB颜色是一种色彩模型，广泛应用于显示技术中，它通过红色、绿色和蓝色三种颜色的不同组合来表示各种颜色。</p>
              <p>2、十六进制颜色值是基于RGB颜色模型的，使用十六进制数来表示每种颜色的强度。</p>
              <p>3、十六进制数可以是从0到F的任意一个值，其中A到F代表了10到15的十进制数值。</p>
              <p>4、RGB颜色与十六进制颜色是相互转换的，可以参考下面的表。</p>
            </div>
          </div>

          <div className="px-8 py-3 bg-white border-y border-slate-100 flex items-center justify-center">
            <span className="text-slate-500 font-bold tracking-widest text-sm">RGB颜色对照表</span>
          </div>

          <div className="overflow-x-auto" id="color-table">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-4 text-sm font-bold text-slate-600 w-1/4">颜色效果</th>
                  <th className="px-8 py-4 text-sm font-bold text-slate-600 w-1/4">英文名</th>
                  <th className="px-8 py-4 text-sm font-bold text-slate-600 w-1/4">R.G.B</th>
                  <th className="px-8 py-4 text-sm font-bold text-slate-600 w-1/4">十六进制</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedColors.map((color, idx) => {
                  const c = colord(color.hex);
                  const rgb = c.toRgb();
                  return (
                    <tr key={`${color.hex}-${color.name}-${idx}`} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-4">
                        <div 
                          className="w-full h-10 rounded shadow-inner border border-slate-100" 
                          style={{ backgroundColor: color.hex }} 
                        />
                      </td>
                      <td className="px-8 py-4 text-slate-600 font-medium">{color.name}</td>
                      <td className="px-8 py-4 text-slate-500 font-mono text-sm">
                        {rgb.r} {rgb.g} {rgb.b}
                      </td>
                      <td className="px-8 py-4 text-slate-500 font-mono text-sm uppercase">
                        <button 
                          onClick={async () => {
                            const success = await copyToClipboard(color.hex);
                            if (success) {
                              addToast(`已成功复制: ${color.hex.toUpperCase()}`);
                            } else {
                              addToast('复制失败', 'error');
                            }
                          }}
                          className="hover:text-blue-500 transition-colors"
                        >
                          {color.hex}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {totalPages > 1 && (
              <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-start gap-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-slate-400 hover:text-blue-500 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="px-3 py-2 text-slate-400">...</span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(Number(page))}
                          className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-all ${
                            currentPage === page 
                              ? 'bg-blue-500 text-white shadow-lg shadow-blue-100' 
                              : 'text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-slate-400 hover:text-blue-500 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {filteredColors.length === 0 && (
              <div className="p-20 text-center text-slate-400 font-medium">
                未找到相关颜色...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </PageContainer>
  );
};

export default RGBReferenceTable;
