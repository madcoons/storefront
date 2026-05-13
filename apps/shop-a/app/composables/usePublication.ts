import { fetchPublication, type PublicationDetailDto } from '@storefront/dam-client'

export const usePublication = (id: number) => {
  const { damBaseUrl } = useRuntimeConfig().public
  return useAsyncData<PublicationDetailDto | null>(
    `publication:${id}`,
    () => fetchPublication(id, { baseUrl: damBaseUrl }),
  )
}
