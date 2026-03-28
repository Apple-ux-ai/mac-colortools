/**
 * 功能：图片颜色拾取子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/PageContainer';
import { Upload, MousePointer2, Copy, History, Info, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { copyToClipboard } from '../../utils/clipboard';

const ImageColorPicker: React.FC = () => {
  const { t } = useTranslation();
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
      addToast(t('toast.copySuccessPlain', { value: text.toUpperCase() }));
    } else {
      addToast(t('toast.copyFailRetry'), 'error');
    }
  };

  return (
    <PageContainer title={t('pickerImage.title')} hideDefaultTitle>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30 border-2 border-white/50">
              <ImageIcon size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{t('pickerImage.title')}</h1>
          </div>
        </div>

        {/* 主要工作区 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧：图片预览 */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-600 shadow-sm overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4 px-2">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold">
                  <ImageIcon size={20} className="text-indigo-600 dark:text-indigo-400" />
                  <span>{t('pickerImage.previewArea')}</span>
                </div>
                <div className="flex items-center gap-2">
                  {image && (
                    <button 
                      onClick={handleRemove}
                      className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/40 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/60 transition-all font-bold text-sm border border-red-100 dark:border-red-800/50"
                      title={t('pickerImage.deleteImage')}
                    >
                      <Trash2 size={16} />
                      <span>{t('common.delete')}</span>
                    </button>
                  )}
                  <label className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl cursor-pointer hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 dark:shadow-indigo-900/30 font-bold text-sm">
                    <Upload size={16} />
                    {t('pickerImage.uploadImage')}
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              </div>

              <div 
                ref={containerRef}
                className="min-h-[400px] max-h-[600px] bg-slate-50 dark:bg-slate-900/80 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600 flex items-center justify-center overflow-hidden relative"
              >
                {image ? (
                  <canvas 
                    ref={canvasRef}
                    onMouseDown={pickColor}
                    className="cursor-crosshair shadow-2xl"
                  />
                ) : (
                  <div className="text-slate-300 dark:text-slate-500 flex flex-col items-center gap-4">
                    <div className="p-6 bg-white dark:bg-slate-700/80 rounded-full shadow-sm">
                      <Upload size={48} strokeWidth={1.5} className="text-slate-200 dark:text-slate-500" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-600 dark:text-slate-400">{t('pickerImage.uploadFirst')}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('pickerImage.uploadFormat')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* 右侧：结果面板 */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-600 shadow-sm sticky top-8">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold mb-6">
                <MousePointer2 size={20} className="text-indigo-600 dark:text-indigo-400" />
                <span>{t('pickerImage.pickResult')}</span>
              </div>
              
              <div 
                className="w-full h-32 rounded-2xl mb-6 shadow-inner border border-slate-100 dark:border-slate-600 transition-colors duration-300 flex items-end justify-end p-4" 
                style={{ backgroundColor: pickedColor }}
              >
                <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold text-white uppercase tracking-widest border border-white/30">
                  {t('pickerImage.previewArea')}
                </div>
              </div>

              <div className="space-y-4">
                <div className="group">
                  <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Hex Code</label>
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/60 rounded-xl flex items-center justify-between border border-transparent dark:border-slate-600 group-hover:border-indigo-100 dark:group-hover:border-indigo-500/50 transition-all">
                    <span className="font-mono font-black text-slate-700 dark:text-slate-200">{pickedColor}</span>
                    <button 
                      onClick={() => handleCopy(pickedColor)}
                      className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/30 text-slate-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-lg transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="group">
                  <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block px-1">RGB Value</label>
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/60 rounded-xl flex items-center justify-between border border-transparent dark:border-slate-600 group-hover:border-indigo-100 dark:group-hover:border-indigo-500/50 transition-all">
                    <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{hexToRgb(pickedColor)}</span>
                    <button 
                      onClick={() => handleCopy(hexToRgb(pickedColor))}
                      className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/30 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-lg transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 历史记录 */}
              {history.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-600">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold mb-4">
                    <History size={18} className="text-slate-400 dark:text-slate-500" />
                    <span className="text-sm">{t('pickerImage.history')}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {history.map((color, index) => (
                      <button
                        key={`${color}-${index}`}
                        onClick={() => setPickedColor(color)}
                        className="w-8 h-8 rounded-lg border border-slate-100 dark:border-slate-600 shadow-sm hover:scale-110 transition-transform"
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
        <div className="bg-blue-50/50 dark:bg-slate-800/60 p-8 rounded-xl border border-blue-100 dark:border-slate-600 space-y-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg">
            <Info size={20} />
            <h3>{t('pickerImage.aboutTitle')}</h3>
          </div>
          <div className="space-y-3 text-blue-800/80 dark:text-slate-300 text-sm leading-relaxed font-medium">
            <p>{t('pickerImage.about1')}</p>
            <p>{t('pickerImage.about2')}</p>
            <p>{t('pickerImage.about3')}</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ImageColorPicker;
