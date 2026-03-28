/**
 * 功能：图片颜色拾取子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState, useRef, useEffect } from 'react';
import PageContainer from '../../components/PageContainer';
import { Upload, MousePointer2, Copy, History, Info, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

const ImageColorPicker: React.FC = () => {
  const addToast = useToastStore((state) => state.addToast);
  const [image, setImage] = useState<string | null>(null);
  const [pickedColor, setPickedColor] = useState('#6366f1');
  const [history, setHistory] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 转换为 RGB 格式
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        // 上传新图时重置画布
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(null);
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = image;
      img.onload = () => {
        // 计算缩放比例以适应容器
        const maxWidth = containerRef.current?.clientWidth || 800;
        const maxHeight = 500;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
      };
    }
  }, [image]);

  const pickColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`.toUpperCase();
      setPickedColor(hex);
      if (!history.includes(hex)) {
        setHistory(prev => [hex, ...prev].slice(0, 10));
      }
    }
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      addToast(`已成功复制: ${text.toUpperCase()}`);
    } else {
      addToast('复制失败，请重试', 'error');
    }
  };

  return (
    <PageContainer title="图片颜色拾取" hideDefaultTitle>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 border-2 border-white/50">
              <ImageIcon size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">图片颜色拾取</h1>
          </div>
        </div>

        {/* 主要工作区 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧：图片预览 */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4 px-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <ImageIcon size={20} className="text-indigo-600" />
                  <span>预览区域</span>
                </div>
                <div className="flex items-center gap-2">
                  {image && (
                    <button 
                      onClick={handleRemove}
                      className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all font-bold text-sm border border-red-100"
                      title="删除图片"
                    >
                      <Trash2 size={16} />
                      <span>删除</span>
                    </button>
                  )}
                  <label className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl cursor-pointer hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 font-bold text-sm">
                    <Upload size={16} />
                    选择图片
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              </div>

              <div 
                ref={containerRef}
                className="min-h-[400px] max-h-[600px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative"
              >
                {image ? (
                  <canvas 
                    ref={canvasRef}
                    onMouseDown={pickColor}
                    className="cursor-crosshair shadow-2xl"
                  />
                ) : (
                  <div className="text-slate-300 flex flex-col items-center gap-4">
                    <div className="p-6 bg-white rounded-full shadow-sm">
                      <Upload size={48} strokeWidth={1.5} className="text-slate-200" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-600">请先上传一张图片</p>
                      <p className="text-xs text-slate-400 mt-1">支持 JPG, PNG, WebP 格式</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* 右侧：结果面板 */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-8">
              <div className="flex items-center gap-2 text-slate-800 font-bold mb-6">
                <MousePointer2 size={20} className="text-indigo-600" />
                <span>拾取结果</span>
              </div>
              
              <div 
                className="w-full h-32 rounded-2xl mb-6 shadow-inner border border-slate-100 transition-colors duration-300 flex items-end justify-end p-4" 
                style={{ backgroundColor: pickedColor }}
              >
                <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold text-white uppercase tracking-widest border border-white/30">
                  预览
                </div>
              </div>

              <div className="space-y-4">
                <div className="group">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1.5 block px-1">Hex Code</label>
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-transparent group-hover:border-indigo-100 transition-all">
                    <span className="font-mono font-black text-slate-700">{pickedColor}</span>
                    <button 
                      onClick={() => handleCopy(pickedColor)}
                      className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="group">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1.5 block px-1">RGB Value</label>
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-transparent group-hover:border-indigo-100 transition-all">
                    <span className="font-mono font-bold text-slate-600">{hexToRgb(pickedColor)}</span>
                    <button 
                      onClick={() => handleCopy(hexToRgb(pickedColor))}
                      className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 历史记录 */}
              {history.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                    <History size={18} className="text-slate-400" />
                    <span className="text-sm">最近拾取</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {history.map((color, index) => (
                      <button
                        key={`${color}-${index}`}
                        onClick={() => setPickedColor(color)}
                        className="w-8 h-8 rounded-lg border border-slate-100 shadow-sm hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* About Section */}
        <div className="bg-blue-50/50 p-8 rounded-xl border border-blue-100 space-y-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
            <Info size={20} />
            <h3>关于图片颜色拾取介绍:</h3>
          </div>
          <div className="space-y-3 text-blue-800/80 text-sm leading-relaxed font-medium">
            <p>1、此工具可以帮助你从本地图片中精准提取任何像素点的颜色值，支持主流图片格式。</p>
            <p>2、上传图片后，只需将鼠标移动到图片上方，系统会自动显示当前坐标的颜色预览。点击即可完成拾取。</p>
            <p>3、本工具提供 HEX 和 RGB 双重格式输出，并自动保存最近 10 次的拾取历史，方便对比与重复使用。</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ImageColorPicker;
