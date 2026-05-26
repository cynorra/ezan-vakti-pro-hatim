import React from 'react';
import Head from 'expo-router/head';
import { Platform } from 'react-native';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  cityName?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Ezan Vakti ve Hatim",
  description = "Diyanet uyumlu namaz vakitleri, kıble bulucu, tesbih, dua ve Türkiye'nin en gelişmiş ortak hatim platformu.",
  keywords = "ezan vakti, namaz vakitleri, hatim, ortak hatim, kıble, diyanet, tesbih, kuran",
  cityName,
  schema,
}) => {
  // Head etiketleri mobil (Native) tarafta hata vermemesi için web kontrolü yapılabilir,
  // ancak expo-router/head bunu kendi içinde yönetir. Yine de Platform.OS kontrolü eklenebilir.
  if (Platform.OS !== 'web') {
    return null; // Head etiketleri sadece web için geçerlidir.
  }

  const appTitle = cityName ? `${cityName} Namaz Vakitleri | Ezan Vakti ve Hatim` : title;

  return (
    <Head>
      <title>{appTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Social Media */}
      <meta property="og:title" content={appTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Ezan Vakti ve Hatim" />

      {/* GEO Tags for Local SEO */}
      <meta name="geo.region" content="TR" />
      {cityName && <meta name="geo.placename" content={cityName} />}

      {/* AEO: Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Head>
  );
};
