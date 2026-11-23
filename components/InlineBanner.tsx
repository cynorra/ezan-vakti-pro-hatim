import React from 'react';
import { BannerAd } from '@/components/BannerAd';

/** In-content banner. Takes no space until an ad has actually loaded. */
export const InlineBanner: React.FC = () => <BannerAd style={{ marginVertical: 12 }} />;
