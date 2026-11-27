import React from 'react';
import { BannerAd, SCREEN_BANNER_IDS, type BannerPlacement } from './BannerAd';

interface InlineBannerProps {
  placement?: BannerPlacement;
}

export const InlineBanner: React.FC<InlineBannerProps> = ({ placement = 'default' }) => (
  <BannerAd unitId={SCREEN_BANNER_IDS[placement]} style={{ marginVertical: 12 }} />
);
