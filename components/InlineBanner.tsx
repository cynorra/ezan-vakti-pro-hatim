import React from 'react';
import { BannerAd, INLINE_BANNER_AD_UNIT_ID } from './BannerAd';

export const InlineBanner: React.FC = () => (
  <BannerAd unitId={INLINE_BANNER_AD_UNIT_ID} style={{ marginVertical: 12 }} />
);
