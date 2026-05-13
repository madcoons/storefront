const crtFile = '../../tls/development.crt'
const keyFile = '../../tls/development.key'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  ssr: true,
  devtools: { enabled: true },
  typescript: { strict: true },
  runtimeConfig: {
    public: {
      storeSlug: process.env.NUXT_PUBLIC_STORE_SLUG ?? '',
      damBaseUrl: process.env.NUXT_PUBLIC_DAM_BASE_URL ?? 'https://localhost:8443',
    },
  },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },
  devServer: {
    https: {
      cert: crtFile,
      key: keyFile,
    },
  },
})
