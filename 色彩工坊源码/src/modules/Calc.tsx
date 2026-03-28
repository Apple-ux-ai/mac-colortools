/**
 * 功能：颜色计算模块主仪表盘
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import PageContainer from '../components/PageContainer';
import FeatureCard from '../components/FeatureCard';
import { Layers, Droplets, Contrast, Split, Repeat } from 'lucide-react';

const CalcDashboard: React.FC = () => {
  return (
    <PageContainer title="颜色计算与处理" showBack={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <FeatureCard
          id="grayscale"
          title="彩图转黑白"
          description="将彩色图片转换为黑白灰度图，支持本地下载与预览。"
          icon={Layers}
          path="/calc/grayscale"
          color="slate"
        />
        <FeatureCard
          id="color-grayscale"
          title="颜色转灰度"
          description="将单一色彩值转换为对应的灰度值，常用于对比度分析。"
          icon={Repeat}
          path="/calc/color-grayscale"
          color="zinc"
        />
        <FeatureCard
          id="mix"
          title="颜色混合"
          description="将两种颜色按比例混合，生成全新的过渡色彩。"
          icon={Droplets}
          path="/calc/mix"
          color="indigo"
        />
        <FeatureCard
          id="intermediate"
          title="中间色计算"
          description="在两个颜色之间生成指定步长的渐变色阶。"
          icon={Split}
          path="/calc/intermediate"
          color="blue"
        />
        <FeatureCard
          id="contrast"
          title="颜色匹配度"
          description="计算前景色与背景色的对比度，检查是否符合 WCAG 标准。"
          icon={Contrast}
          path="/calc/contrast"
          color="amber"
        />
        <FeatureCard
          id="opposite"
          title="相反颜色计算"
          description="快速获取当前颜色的补色（色相环 180 度相对色）。"
          icon={Repeat}
          path="/calc/opposite"
          color="rose"
        />
      </div>
    </PageContainer>
  );
};

export default CalcDashboard;
