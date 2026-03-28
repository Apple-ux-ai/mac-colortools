/**
 * 功能：颜色计算模块主仪表盘
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../components/PageContainer';
import FeatureCard from '../components/FeatureCard';
import { Layers, Droplets, Contrast, Split, Repeat, Eye } from 'lucide-react';

const CalcDashboard: React.FC = () => {
  const { t } = useTranslation();
  return (
    <PageContainer title={t('calc.title')} showBack={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <FeatureCard id="grayscale" title={t('calc.grayscale')} description={t('calc.grayscaleDesc')} icon={Layers} path="/calc/grayscale" color="slate" />
        <FeatureCard id="color-grayscale" title={t('calc.colorGrayscale')} description={t('calc.colorGrayscaleDesc')} icon={Repeat} path="/calc/color-grayscale" color="zinc" />
        <FeatureCard id="mix" title={t('calc.mix')} description={t('calc.mixDesc')} icon={Droplets} path="/calc/mix" color="indigo" />
        <FeatureCard id="intermediate" title={t('calc.intermediate')} description={t('calc.intermediateDesc')} icon={Split} path="/calc/intermediate" color="blue" />
        <FeatureCard id="contrast" title={t('calc.contrast')} description={t('calc.contrastDesc')} icon={Contrast} path="/calc/contrast" color="amber" />
        <FeatureCard id="colorblind" title={t('calc.colorblind')} description={t('calc.colorblindDesc')} icon={Eye} path="/calc/colorblind" color="green" />
        <FeatureCard id="opposite" title={t('calc.opposite')} description={t('calc.oppositeDesc')} icon={Repeat} path="/calc/opposite" color="rose" />
      </div>
    </PageContainer>
  );
};

export default CalcDashboard;
