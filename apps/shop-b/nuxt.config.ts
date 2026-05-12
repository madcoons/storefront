export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  ssr: true,
  devtools: { enabled: true },
  typescript: { strict: true },
  runtimeConfig: {
    public: {
      storeSlug: process.env.NUXT_PUBLIC_STORE_SLUG ?? '',
      damBaseUrl: process.env.NUXT_PUBLIC_DAM_BASE_URL ?? 'https://localhost:5256',
    },
  },
})
