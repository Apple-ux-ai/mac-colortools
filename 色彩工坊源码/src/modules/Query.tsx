/**
 * 功能：颜色查询模块主仪表盘
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import PageContainer from '../components/PageContainer';
import FeatureCard from '../components/FeatureCard';
import { RefreshCw, Globe, MousePointer2, Palette, Table } from 'lucide-react';

const QueryDashboard: React.FC = () => {
  return (
    <PageContainer title="颜色查询与工具" showBack={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <FeatureCard
          id="convert"
          title="颜色值转换"
          description="在 Hex, RGB, CMYK, HSL, HSV 等多种颜色格式间进行即时转换。"
          icon={RefreshCw}
          path="/query/convert"
          color="indigo"
        />
        <FeatureCard
          id="picker"
          title="高级颜色选择器"
          description="功能丰富的颜色选取工具，支持多种色域与实时预览。"
          icon={MousePointer2}
          path="/query/picker"
          color="blue"
        />
        <FeatureCard
          id="gradients"
          title="渐变色大全"
          description="精选的高质量渐变色方案，一键复制 CSS 代码。"
          icon={Palette}
          path="/query/gradients"
          color="purple"
        />
        <FeatureCard
          id="websafe"
          title="Web 安全色"
          description="查看经典的 216 种 Web 安全色，确保在旧设备上的色彩显示一致性。"
          icon={Globe}
          path="/query/websafe"
          color="teal"
        />
        <FeatureCard
          id="rgb-reference"
          title="RGB 颜色对照表"
          description="查看常用标准色的 RGB 数值及 CSS 格式，支持一键复制。"
          icon={Table}
          path="/query/rgb-reference"
          color="indigo"
        />
        <FeatureCard
          id="cmyk-reference"
          title="CMYK 颜色对照表"
          description="查看常用标准色的 CMYK 换算数值，为印刷设计提供参考。"
          icon={Table}
          path="/query/cmyk-reference"
          color="amber"
        />
      </div>
    </PageContainer>
  );
};

export default QueryDashboard;
