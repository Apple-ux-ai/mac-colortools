/**
 * 功能：颜色查询模块主仪表盘
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../components/PageContainer';
import FeatureCard from '../components/FeatureCard';
import { RefreshCw, Globe, MousePointer2, Palette, Table, Bookmark } from 'lucide-react';

const QueryDashboard: React.FC = () => {
  const { t } = useTranslation();
  return (
    <PageContainer title={t('query.title')} showBack={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <FeatureCard id="convert" title={t('query.convert')} description={t('query.convertDesc')} icon={RefreshCw} path="/query/convert" color="indigo" />
        <FeatureCard id="picker" title={t('query.picker')} description={t('query.pickerDesc')} icon={MousePointer2} path="/query/picker" color="blue" />
        <FeatureCard id="gradients" title={t('query.gradients')} description={t('query.gradientsDesc')} icon={Palette} path="/query/gradients" color="purple" />
        <FeatureCard id="websafe" title={t('query.websafe')} description={t('query.websafeDesc')} icon={Globe} path="/query/websafe" color="teal" />
        <FeatureCard id="rgb-reference" title={t('query.rgbReference')} description={t('query.rgbReferenceDesc')} icon={Table} path="/query/rgb-reference" color="indigo" />
        <FeatureCard id="cmyk-reference" title={t('query.cmykReference')} description={t('query.cmykReferenceDesc')} icon={Table} path="/query/cmyk-reference" color="amber" />
        <FeatureCard id="palettes" title={t('query.palettes')} description={t('query.palettesDesc')} icon={Bookmark} path="/query/palettes" color="pink" />
      </div>
    </PageContainer>
  );
};

export default QueryDashboard;
