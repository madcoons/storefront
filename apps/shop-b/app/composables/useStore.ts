import { fetchStoreBySlug, type PublicUserStoreDto } from '@storefront/dam-client'

export const useStore = () => {
  const { storeSlug, damBaseUrl } = useRuntimeConfig().public
  return useAsyncData<PublicUserStoreDto | null>(
    `store:${storeSlug}`,
    () => fetchStoreBySlug(storeSlug, { baseUrl: damBaseUrl }),
  )
}
