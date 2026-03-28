/**
 * 功能：传统色彩模块主仪表盘
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import PageContainer from '../components/PageContainer';
import FeatureCard from '../components/FeatureCard';
import { Palette, Flag } from 'lucide-react';

const TraditionalDashboard: React.FC = () => {
  return (
    <PageContainer title="传统色彩资源" showBack={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <FeatureCard
          id="china"
          title="中国传统色彩"
          description="五千年华夏文明沉淀的绝美色系，包含朱砂、胭脂、天青等经典色彩。"
          icon={Palette}
          path="/traditional/china"
          color="red"
        />
        <FeatureCard
          id="japan"
          title="日本传统色彩"
          description="和风美学的极致体现，收录樱色、茜色、瑠璃色等大和传统色。"
          icon={Flag}
          path="/traditional/japan"
          color="indigo"
        />
      </div>
    </PageContainer>
  );
};

export default TraditionalDashboard;
