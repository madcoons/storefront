import type {
  PublicUserStoreDto,
  StorePublicationDto,
  PaginatedResult,
  PublicationDetailDto,
  CreateStoreCheckoutDto,
  StoreCheckoutResultDto,
  EstimateShippingRequestDto,
  ShippingEstimateResultDto,
} from '@storefront/dam-types'

export interface DamClientOptions {
  baseUrl: string
}

export class DamFetchError extends Error {
  constructor(public status: number, public url: string, message: string) {
    super(message)
    this.name = 'DamFetchError'
  }
}

export async function fetchStoreBySlug(
  slug: string,
  opts: DamClientOptions,
): Promise<PublicUserStoreDto | null> {
  return fetchOrNull<PublicUserStoreDto>(
    `${opts.baseUrl}/stores/${encodeURIComponent(slug)}/public`,
  )
}

export async function fetchStoreByDomain(
  hostname: string,
  opts: DamClientOptions,
): Promise<PublicUserStoreDto | null> {
  return fetchOrNull<PublicUserStoreDto>(
    `${opts.baseUrl}/stores/by-domain/${encodeURIComponent(hostname)}/public`,
  )
}

export async function fetchPublications(
  slug: string,
  opts: DamClientOptions & { pageIndex?: number; pageSize?: number },
): Promise<PaginatedResult<StorePublicationDto> | null> {
  const pageIndex = opts.pageIndex ?? 0
  const pageSize = opts.pageSize ?? 24
  return fetchOrNull<PaginatedResult<StorePublicationDto>>(
    `${opts.baseUrl}/stores/${encodeURIComponent(slug)}/publications?pageIndex=${pageIndex}&pageSize=${pageSize}`,
  )
}

export async function fetchPublication(
  publicationId: number,
  opts: DamClientOptions,
): Promise<PublicationDetailDto | null> {
  return fetchOrNull<PublicationDetailDto>(
    `${opts.baseUrl}/stores/publications/${publicationId}`,
  )
}

export async function estimateShipping(
  slug: string,
  body: EstimateShippingRequestDto,
  opts: DamClientOptions,
): Promise<ShippingEstimateResultDto | null> {
  return postJson<ShippingEstimateResultDto>(
    `${opts.baseUrl}/stores/${encodeURIComponent(slug)}/shipping/estimate`,
    body,
  )
}

export async function createCheckout(
  slug: string,
  body: CreateStoreCheckoutDto,
  opts: DamClientOptions,
): Promise<StoreCheckoutResultDto> {
  const url = `${opts.baseUrl}/stores/${encodeURIComponent(slug)}/checkout`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new DamFetchError(res.status, url, `Checkout failed: ${text}`)
  }
  return res.json() as Promise<StoreCheckoutResultDto>
}

async function fetchOrNull<T>(url: string): Promise<T | null> {
  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    console.error('[dam-client] network error', { url, err })
    return null
  }
  if (res.status === 404) return null
  if (!res.ok) {
    console.error('[dam-client] non-OK response', { url, status: res.status })
    return null
  }
  return res.json() as Promise<T>
}

async function postJson<T>(url: string, body: unknown): Promise<T | null> {
  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch (err) {
    console.error('[dam-client] network error', { url, err })
    return null
  }
  if (!res.ok) {
    console.error('[dam-client] non-OK response', { url, status: res.status })
    return null
  }
  return res.json() as Promise<T>
}

export type {
  PublicUserStoreDto,
  StorePublicationDto,
  PublicationMeta,
  PaginatedResult,
  PublicationDetailDto,
  PublicationVariantDto,
  PublicationOptionDto,
  PublicationOptionValueDto,
  PublicationFileDto,
  CheckoutItemDto,
  CreateStoreCheckoutDto,
  StoreCheckoutResultDto,
  StoreShippingAddressDto,
  EstimateShippingRequestDto,
  ShippingEstimateResultDto,
  ProviderShippingEstimateDto,
} from '@storefront/dam-types'
