// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'static',
  site: 'https://novelty.pages.dev', // 実際のCloudflare PagesのURLに置き換え
  build: {
    inlineStylesheets: 'auto',
  },
  // SSG最適化設定
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  // microCMSからの画像最適化
  image: {
    domains: ['images.microcms-assets.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.microcms-assets.io',
      },
    ],
  },
  // ビルド時のエラーハンドリング
  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // microCMS接続エラーをビルド時に無視
          if (
            warning.code === 'UNRESOLVED_IMPORT' &&
            warning.message?.includes('microcms')
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
});
