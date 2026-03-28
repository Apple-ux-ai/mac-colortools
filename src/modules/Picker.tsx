/**
 * 功能：颜色拾取模块主仪表盘
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../components/PageContainer';
import FeatureCard from '../components/FeatureCard';
import { Image as ImageIcon, Monitor } from 'lucide-react';

const PickerDashboard: React.FC = () => {
  const { t } = useTranslation();
  return (
    <PageContainer title={t('picker.title')} showBack={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <FeatureCard id="image" title={t('picker.image')} description={t('picker.imageDesc')} icon={ImageIcon} path="/picker/image" color="indigo" />
        <FeatureCard id="screen" title={t('picker.screen')} description={t('picker.screenDesc')} icon={Monitor} path="/picker/screen" color="blue" />
      </div>
    </PageContainer>
  );
};

export default PickerDashboard;
