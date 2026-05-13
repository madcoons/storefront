import { fetchPublications, type StorePublicationDto, type PaginatedResult } from '@storefront/dam-client'

export const usePublications = (pageIndex = 0, pageSize = 24) => {
  const { storeSlug, damBaseUrl } = useRuntimeConfig().public
  return useAsyncData<PaginatedResult<StorePublicationDto> | null>(
    `publications:${storeSlug}:${pageIndex}`,
    () => fetchPublications(storeSlug, { baseUrl: damBaseUrl, pageIndex, pageSize }),
  )
}
