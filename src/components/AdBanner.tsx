/**
 * 功能：广告位组件
 * 接入规范参考：接入文档.md
 */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface AdData {
  soft_number: number;
  adv_position: string;
  adv_url: string;
  target_url: string;
  width: number;
  height: number;
}

interface AdBannerProps {
  position: string;
  className?: string;
  aspectRatio?: string; // 如 "4/1" 或 "2/3"
}

const { shell } = window.require ? window.require('electron') : { shell: null };

const AdBanner: React.FC<AdBannerProps> = ({ position, className = '', aspectRatio }) => {
  const [ad, setAd] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAdClick = (e: React.MouseEvent) => {
    if (ad?.target_url) {
      if (shell) {
        e.preventDefault();
        shell.openExternal(ad.target_url);
      }
    }
  };

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const params = new URLSearchParams();
        params.append('soft_number', '10024');
        params.append('adv_position', position);

        const response = await axios.post('https://api-web.kunqiongai.com/soft_desktop/get_adv', params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        if (response.data.code === 1 && response.data.data && response.data.data.length > 0) {
          setAd(response.data.data[0]);
        }
      } catch (error) {
        console.error(`加载广告位 ${position} 失败:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [position]);

  if (loading) {
    return (
      <div 
        className={`bg-slate-100 animate-pulse rounded-xl ${className}`}
        style={{ aspectRatio: aspectRatio }}
      />
    );
  }

  if (!ad) return null;

  return (
    <a 
      href={ad.target_url} 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={handleAdClick}
      className={`block overflow-hidden rounded-xl hover:opacity-90 transition-opacity shadow-sm border border-slate-100 ${className}`}
      style={{ aspectRatio: aspectRatio }}
    >
      <img 
        src={ad.adv_url} 
        alt={`广告 - ${position}`} 
        className="w-full h-full object-cover"
      />
    </a>
  );
};

export default AdBanner;
