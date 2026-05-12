import type { PublicUserStoreDto } from '@storefront/dam-types'

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

export type { PublicUserStoreDto } from '@storefront/dam-types'
