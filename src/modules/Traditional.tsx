/**
 * 功能：传统色彩模块主仪表盘
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../components/PageContainer';
import FeatureCard from '../components/FeatureCard';
import { Palette, Flag } from 'lucide-react';

const TraditionalDashboard: React.FC = () => {
  const { t } = useTranslation();
  return (
    <PageContainer title={t('traditional.title')} showBack={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <FeatureCard id="china" title={t('traditional.china')} description={t('traditional.chinaDesc')} icon={Palette} path="/traditional/china" color="red" />
        <FeatureCard id="japan" title={t('traditional.japan')} description={t('traditional.japanDesc')} icon={Flag} path="/traditional/japan" color="indigo" />
      </div>
    </PageContainer>
  );
};

export default TraditionalDashboard;
