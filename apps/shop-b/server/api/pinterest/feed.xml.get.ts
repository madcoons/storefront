import { fetchPublications, fetchStoreBySlug } from '@storefront/dam-client'
import type { PublicationMeta } from '@storefront/dam-types'
import {
  buildProductFeedXml,
  mapPublicationToFeedItem,
  type PinterestFeedItem,
} from '@storefront/pinterest-catalog'

const PAGE_SIZE = 24
const MAX_PAGES = 200
const MAX_ITEMS = 5000

export default defineEventHandler(async (event) => {
  const { storeSlug, damBaseUrl, siteUrl, pinterestFeedCurrency } = useRuntimeConfig(event).public

  const origin = siteUrl || getRequestURL(event).origin
  const currency = pinterestFeedCurrency || 'USD'

  const store = await fetchStoreBySlug(storeSlug, { baseUrl: damBaseUrl })
  const brand = store?.name ?? null

  const items: PinterestFeedItem[] = []
  for (let pageIndex = 0; pageIndex < MAX_PAGES; pageIndex++) {
    const page = await fetchPublications(storeSlug, {
      baseUrl: damBaseUrl,
      pageIndex,
      pageSize: PAGE_SIZE,
    })
    if (!page || page.items.length === 0) break

    for (const pub of page.items) {
      let meta: PublicationMeta
      try {
        meta = JSON.parse(pub.metaValues)
      } catch {
        continue
      }
      const feedItem = mapPublicationToFeedItem(pub, meta, {
        siteUrl: origin,
        damBaseUrl,
        currency,
        brand,
      })
      if (feedItem) items.push(feedItem)
    }

    if (items.length >= MAX_ITEMS) break
    if (page.items.length < PAGE_SIZE) break
  }

  const xml = buildProductFeedXml(items, {
    title: brand ? `${brand} — Product Feed` : 'Product Feed',
    link: origin,
    description: store?.description || `Product catalog feed for ${brand ?? storeSlug}`,
  })

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'cache-control', 's-maxage=3600, stale-while-revalidate')
  return xml
})
