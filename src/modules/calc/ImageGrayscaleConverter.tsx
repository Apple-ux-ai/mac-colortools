/**
 * 功能：彩图转黑白子页
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Download, Info, Trash2 } from 'lucide-react';
import PageContainer from '../../components/PageContainer';

const ImageGrayscaleConverter: React.FC = () => {
  const { t } = useTranslation();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [grayscaleImage, setGrayscaleImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOriginalImage(null);
    setGrayscaleImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setOriginalImage(result);
        convertToGrayscale(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertToGrayscale = (imageSrc: string) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        // 使用 Luminance 算法: 0.299R + 0.587G + 0.114B
        const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = avg;     // R
        data[i + 1] = avg; // G
        data[i + 2] = avg; // B
      }

      ctx.putImageData(imageData, 0, 0);
      setGrayscaleImage(canvas.toDataURL('image/png'));
    };
  };

  const handleDownload = () => {
    if (grayscaleImage) {
      const link = document.createElement('a');
      link.download = 'grayscale-image.png';
      link.href = grayscaleImage;
      link.click();
    }
  };

  return (
    <PageContainer title={t('calcImageGrayscale.title')} hideDefaultTitle>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-100 dark:shadow-slate-900/30 border-2 border-white/50 dark:border-slate-600/50">
              <Upload size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{t('calcImageGrayscale.title')}</h1>
          </div>
        </div>

        {/* Main Conversion Area */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-600 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,2px,1fr] gap-12 items-stretch min-h-[400px]">
            {/* Left: Original */}
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold">
                  <Upload size={20} className="text-orange-600 dark:text-orange-400" />
                  <span>{t('calcImageGrayscale.originalImage')}</span>
                </div>
                {originalImage && (
                  <button 
                    onClick={handleRemove}
                    className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/40 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-800/40 transition-all font-bold text-sm border border-red-100 dark:border-red-800"
                    title={t('calcImageGrayscale.deleteImage')}
                  >
                    <Trash2 size={16} />
                    <span>{t('common.delete')}</span>
                  </button>
                )}
              </div>
              
              <div className="flex-1 w-full bg-slate-50 dark:bg-slate-700/60 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-500 overflow-hidden flex items-center justify-center relative group cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-700 transition-all min-h-[300px]"
                onClick={() => fileInputRef.current?.click()}
              >
                {originalImage ? (
                  <img src={originalImage} alt="Original" className="max-w-full max-h-[300px] object-contain" />
                ) : (
                  <div className="text-slate-300 dark:text-slate-500 flex flex-col items-center gap-4">
                    <div className="p-6 bg-white dark:bg-slate-600 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <Upload size={48} strokeWidth={1.5} className="text-slate-200 dark:text-slate-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-400 dark:text-slate-500">{t('calcImageGrayscale.uploadFirst')}</p>
                      <p className="text-xs text-slate-300 dark:text-slate-500 mt-1">{t('calcImageGrayscale.uploadFormat')}</p>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-200 dark:shadow-orange-900/30 transition-all flex items-center justify-center gap-2"
              >
                <Upload size={20} />
                <span>{t('calcImageGrayscale.uploadImage')}</span>
              </button>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} accept="image/*" />
            </div>

            {/* Middle Separator */}
            <div className="hidden md:block w-[2px] bg-slate-100 dark:bg-slate-600 self-stretch my-10" />

            {/* Right: Result */}
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold">
                  <Download size={20} className="text-indigo-600 dark:text-indigo-400" />
                  <span>{t('calcImageGrayscale.result')}</span>
                </div>
              </div>
              
              <div className="flex-1 w-full bg-indigo-50/30 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100/50 dark:border-indigo-800/50 overflow-hidden flex items-center justify-center relative min-h-[300px]">
                {grayscaleImage ? (
                  <img src={grayscaleImage} alt="Grayscale" className="max-w-full max-h-[300px] object-contain" />
                ) : (
                  <div className="text-slate-300 dark:text-slate-500 flex flex-col items-center gap-2">
                    <Download size={48} className="opacity-20" />
                    <p className="text-sm font-medium">{t('calcImageGrayscale.resultPreview')}</p>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <button
                onClick={handleDownload}
                disabled={!grayscaleImage}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border ${
                  grayscaleImage 
                    ? 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-500 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600' 
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-100 dark:border-slate-600 text-slate-300 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                <Download size={20} />
                <span>{t('calcImageGrayscale.downloadImage')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-orange-50/50 dark:bg-orange-900/20 p-8 rounded-xl border border-orange-100 dark:border-orange-800/50 space-y-4">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-lg">
            <Info size={20} />
            <h3>{t('calcImageGrayscale.aboutTitle')}</h3>
          </div>
          <div className="space-y-3 text-orange-800/80 dark:text-orange-200/90 text-sm leading-relaxed font-medium">
            <p>{t('calcImageGrayscale.about1')}</p>
            <p>{t('calcImageGrayscale.about2')}</p>
            <p>{t('calcImageGrayscale.about3')}</p>
            <p>{t('calcImageGrayscale.about4')}</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ImageGrayscaleConverter;
