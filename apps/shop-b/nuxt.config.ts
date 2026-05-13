const crtFile = '../../tls/development.crt'
const keyFile = '../../tls/development.key'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  ssr: true,
  devtools: { enabled: true },
  typescript: { strict: true },
  runtimeConfig: {
    public: {
      storeSlug: '',
      damBaseUrl: 'https://localhost:8443',
    },
  },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap',
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
