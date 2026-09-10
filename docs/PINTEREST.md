# Pinterest integration

Each storefront app (`shop-a`, `shop-b`) ships three Pinterest features: a product
catalog feed, the Pinterest Tag (conversion tracking), and Rich Pins metadata.

## 1. Product catalog feed

Every app exposes an RSS 2.0 product feed in the Google Merchant `g:` namespace,
which Pinterest's catalog data-source ingestion accepts:

```
/api/pinterest/feed.xml
```

Register the full URL (e.g. `https://shop.example.com/api/pinterest/feed.xml`) as a
data source in your Pinterest catalog. The feed is generated server-side from the
store's published Publications in the DAM and is cached for one hour
(`s-maxage=3600, stale-while-revalidate`).

The mapping and XML generation live in the shared `@storefront/pinterest-catalog`
package so both apps stay in sync.

- `link` and the feed `<link>` use `NUXT_PUBLIC_SITE_URL` when set, otherwise the
  incoming request origin.
- Prices use `NUXT_PUBLIC_PINTEREST_FEED_CURRENCY` (ISO 4217, default `USD`).
- Availability is `in stock` for digital, self-fulfilling, or in-stock items,
  otherwise `out of stock`.
- Publications without a title, a usable price, or an image are skipped.

## 2. Pinterest Tag (conversion tracking)

Set the Pinterest Tag id to enable conversion tracking:

```
NUXT_PUBLIC_PINTEREST_TAG_ID=<your-tag-id>
```

When set, a client plugin loads the official `pintrk` base pixel, fires a `page`
event on load and a `pagevisit` on every route change. The `usePinterestTag()`
composable exposes a `track(event, data?)` helper; the storefront already fires:

- `addtocart` when a product is added to the bag (`{ value, currency, product_id }`)
- `checkout` on the order-confirmation page (`{ value, currency }`)

Leave the id blank to disable the tag entirely (no pixel is injected).

## 3. Rich Pins

Product pages emit Open Graph product metadata (`og:type=product`, `og:title`,
`og:description`, `og:image`, `og:availability`, `product:price:amount`,
`product:price:currency`) via `useSeoMeta` / `useHead`, so Pinterest can render
Rich Pins for shared product URLs.

## Scope

This storefront only handles the catalog feed, the conversion tag, and Rich Pins
metadata. Outbound OAuth-based publishing and Pinterest ads-account management are
the responsibility of the separate DAM backend, not this repo.
