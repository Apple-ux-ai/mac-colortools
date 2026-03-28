/**
 * 功能：颜色拾取模块主仪表盘
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import PageContainer from '../components/PageContainer';
import FeatureCard from '../components/FeatureCard';
import { Image as ImageIcon, Monitor } from 'lucide-react';

const PickerDashboard: React.FC = () => {
  return (
    <PageContainer title="颜色拾取与提取" showBack={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <FeatureCard
          id="image"
          title="图片颜色拾取"
          description="上传本地图片，点击像素点获取精确的 Hex/RGB 颜色值。"
          icon={ImageIcon}
          path="/picker/image"
          color="indigo"
        />
        <FeatureCard
          id="screen"
          title="屏幕颜色拾取"
          description="使用屏幕取色器，选取整个屏幕上任意像素的色彩。"
          icon={Monitor}
          path="/picker/screen"
          color="blue"
        />
      </div>
    </PageContainer>
  );
};

export default PickerDashboard;
