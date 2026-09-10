// Builds a Pinterest / Google Merchant compatible product feed (RSS 2.0 with the
// `g:` namespace) from DAM publications. Pinterest's catalog data-source ingestion
// accepts this format. Pure string building — no external dependencies.

import type { PublicationMeta, StorePublicationDto } from '@storefront/dam-types'

export interface PinterestFeedItem {
  id: string
  title: string
  description: string
  link: string
  imageLink: string
  availability: string
  price: string
  currency: string
  condition: string
  productType: string | null
  brand: string | null
}

export interface FeedItemMapOptions {
  siteUrl: string
  damBaseUrl: string
  currency: string
  brand?: string | null
}

export interface FeedChannel {
  title: string
  link: string
  description: string
}

function imageLinkFor(uuid: string, damBaseUrl: string): string {
  return `${damBaseUrl}/cdn/thumbs/design-publication-file/file/${uuid}.jpeg?width=800&type=image/webp`
}

/**
 * Maps a `StorePublicationDto` plus its parsed `PublicationMeta` to a feed item.
 * Returns `null` when the publication cannot produce a valid entry (missing
 * title, no usable price, or no image).
 */
export function mapPublicationToFeedItem(
  publication: StorePublicationDto,
  meta: PublicationMeta,
  opts: FeedItemMapOptions,
): PinterestFeedItem | null {
  const title = meta.title?.trim()
  if (!title) return null

  const priceValue = meta.price || meta.minPrice
  if (!(priceValue > 0)) return null

  const imageUuid = publication.imageUuid ?? meta.primaryFile?.uuid ?? null
  if (!imageUuid) return null

  const inStock = publication.isDigital || meta.isSelfFulfilling || meta.quantity > 0
  const productType = meta.tags.length ? meta.tags.join(' > ') : null

  return {
    id: String(publication.id),
    title,
    description: meta.description ?? '',
    link: `${opts.siteUrl}/product/${publication.id}`,
    imageLink: imageLinkFor(imageUuid, opts.damBaseUrl),
    availability: inStock ? 'in stock' : 'out of stock',
    price: priceValue.toFixed(2),
    currency: opts.currency,
    condition: 'new',
    productType,
    brand: opts.brand ?? null,
  }
}

/** Escapes text for safe inclusion in XML element content and attributes. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function tag(name: string, value: string): string {
  return `      <${name}>${escapeXml(value)}</${name}>`
}

/** Builds a valid RSS 2.0 product feed string in the Google Merchant `g:` namespace. */
export function buildProductFeedXml(items: PinterestFeedItem[], channel: FeedChannel): string {
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
    '  <channel>',
    `    <title>${escapeXml(channel.title)}</title>`,
    `    <link>${escapeXml(channel.link)}</link>`,
    `    <description>${escapeXml(channel.description)}</description>`,
  ]

  for (const item of items) {
    lines.push('    <item>')
    lines.push(tag('g:id', item.id))
    lines.push(tag('g:title', item.title))
    lines.push(tag('g:description', item.description))
    lines.push(tag('g:link', item.link))
    lines.push(tag('g:image_link', item.imageLink))
    lines.push(tag('g:availability', item.availability))
    lines.push(tag('g:price', `${item.price} ${item.currency}`))
    lines.push(tag('g:condition', item.condition))
    if (item.productType) lines.push(tag('g:product_type', item.productType))
    if (item.brand) lines.push(tag('g:brand', item.brand))
    lines.push('    </item>')
  }

  lines.push('  </channel>')
  lines.push('</rss>')
  lines.push('')

  return lines.join('\n')
}
