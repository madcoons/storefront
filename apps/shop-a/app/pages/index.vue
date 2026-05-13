<script setup lang="ts">
import { fetchPublication, type PublicationMeta, type StorePublicationDto } from '@storefront/dam-client'

const { data: store, error } = await useStore()
const { data: publications } = await usePublications()
const { addItem, openCart } = useCart()
const { damBaseUrl, storeSlug } = useRuntimeConfig().public

function parseMeta(raw: string): PublicationMeta {
  return JSON.parse(raw)
}

function formatPrice(min: number, max: number): string {
  if (min === max) return `$${min.toFixed(2)}`
  return `$${min.toFixed(2)} – $${max.toFixed(2)}`
}

function imageUrl(uuid: string): string {
  return `${damBaseUrl}/cdn/thumbs/design-publication-file/file/${uuid}.jpeg?width=800&type=image/webp`
}

const storeName = computed(() => store.value?.name || 'VOLT/72')

const addingId = ref<number | null>(null)

async function quickAdd(pub: StorePublicationDto, e: Event) {
  e.stopPropagation()
  e.preventDefault()
  addingId.value = pub.id
  try {
    const detail = await fetchPublication(pub.id, { baseUrl: damBaseUrl })
    if (!detail?.items?.length) { await navigateTo(`/product/${pub.id}`); return }
    if (detail.items.length > 1) { await navigateTo(`/product/${pub.id}`); return }
    const variant = detail.items[0]
    const meta = parseMeta(pub.metaValues)
    addItem({
      variantId: variant.id,
      podProductVariantId: variant.podProductVariantId ?? undefined,
      podProductPartnerId: variant.podProductPartnerId ?? undefined,
      publicationId: String(pub.id),
      storeSlug,
      title: meta.title,
      price: variant.price,
      quantity: 1,
      imageUrl: pub.imageUuid ? imageUrl(pub.imageUuid) : null,
      isDigital: pub.isDigital,
      attributesSummary: '',
    })
    openCart()
  } finally {
    addingId.value = null
  }
}
</script>

<template>
  <main>
    <!-- ── Hero ─────────────────────────────────────────────────────────── -->
    <section class="hero">
      <div class="hero-text">
        <div class="hero-eyebrow">
          <span class="eyebrow-dot" />
          {{ storeName }} · NOW LIVE
        </div>
        <h1 class="hero-headline">
          BUILD<br />
          <span class="accent">HARDER</span><br />
          BODIES.
        </h1>
        <p v-if="store?.description" class="hero-desc">{{ store.description }}</p>
        <div class="hero-actions">
          <NuxtLink
            v-if="publications?.items?.[0]"
            :to="`/product/${publications.items[0].id}`"
            class="btn-primary"
          >
            ▶ SHOP NOW
          </NuxtLink>
          <NuxtLink to="/" class="btn-secondary">VIEW ALL →</NuxtLink>
        </div>
      </div>
      <div class="hero-img-wrap">
        <div class="hero-badge">NEW · DROP 014</div>
        <div class="hero-img-inner">
          <span>HERO IMAGE</span>
        </div>
      </div>
    </section>

    <!-- ── Stat strip ────────────────────────────────────────────────────── -->
    <section class="stats">
      <div
        v-for="([n, l], i) in [['48,200+','ATHLETES TRAINED'],['94%','FINISH RATE'],['6 YRS','SINCE LAUNCH'],['4.9 ★','AVG. SCORE']]"
        :key="n"
        class="stat-item"
        :style="i < 3 ? 'border-right: 1px solid var(--line)' : ''"
      >
        <div class="stat-n">{{ n }}</div>
        <div class="stat-l">{{ l }}</div>
      </div>
    </section>

    <!-- ── Products ──────────────────────────────────────────────────────── -->
    <section class="products-section">
      <div class="products-header">
        <div>
          <div class="section-eyebrow">[01] · THE LINEUP</div>
          <h2 class="section-title">The full arsenal.</h2>
        </div>
      </div>

      <template v-if="publications?.items?.length">
        <div class="product-grid">
          <NuxtLink
            v-for="(pub, i) in publications.items"
            :key="pub.id"
            :to="`/product/${pub.id}`"
            class="product-card"
          >
            <div class="card-img-wrap">
              <img
                v-if="pub.imageUuid"
                :src="imageUrl(pub.imageUuid)"
                :alt="parseMeta(pub.metaValues).title"
                class="card-img"
              />
              <div v-else class="card-img-placeholder"><span>PRODUCT IMAGE</span></div>
              <div class="card-tag">{{ pub.isDigital ? 'Digital' : 'Physical' }}</div>
              <div v-if="i === 0" class="card-hot">HOT</div>
              <button class="card-add-overlay" @click="quickAdd(pub, $event)">
                {{ addingId === pub.id ? '...' : '+ ADD TO BAG' }}
              </button>
            </div>
            <div class="card-body">
              <div class="card-title-row">
                <div class="card-name">{{ parseMeta(pub.metaValues).title }}</div>
                <div class="card-price">{{ formatPrice(parseMeta(pub.metaValues).minPrice, parseMeta(pub.metaValues).maxPrice) }}</div>
              </div>
              <div v-if="parseMeta(pub.metaValues).tags.length" class="card-tags">
                <span v-for="tag in parseMeta(pub.metaValues).tags.slice(0, 2)" :key="tag" class="tag-chip">{{ tag }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </template>

      <div v-else-if="!store" class="empty">
        <div class="empty-head">NO STORE CONNECTED</div>
        <p>Configure <code>NUXT_PUBLIC_STORE_SLUG</code> and <code>NUXT_PUBLIC_DAM_BASE_URL</code>.</p>
        <p v-if="error" class="err">{{ error.message }}</p>
      </div>
      <div v-else class="empty">
        <div class="empty-head">NO PRODUCTS YET</div>
        <p>Products will appear here once published in the DAM.</p>
      </div>
    </section>

    <!-- ── Callout block ─────────────────────────────────────────────────── -->
    <section class="callout">
      <div class="callout-text">
        <div class="callout-eyebrow">[02] · FLAGSHIP</div>
        <h3 class="callout-title">SHRED/90<br /><span class="callout-sub">90 DAYS · FULL SYSTEM</span></h3>
        <NuxtLink to="/" class="callout-btn">ENROLL NOW →</NuxtLink>
      </div>
      <div class="callout-img"><span>PROGRAM IMAGE</span></div>
    </section>
  </main>
</template>

<style scoped>
/* ── Hero ───────────────────────────────────────────────────────────────── */
.hero {
  padding: 56px 48px 72px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  align-items: stretch;
}
.hero-eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.eyebrow-dot {
  width: 8px; height: 8px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(214, 255, 61, 0.2);
  flex-shrink: 0;
}
.hero-headline {
  font-family: var(--font-display);
  font-size: clamp(72px, 9vw, 120px);
  line-height: 0.88;
  letter-spacing: -2px;
  margin: 0 0 24px;
  text-transform: uppercase;
}
.accent { color: var(--accent); }
.hero-desc {
  font-size: 15px;
  color: var(--muted);
  max-width: 440px;
  margin: 0 0 28px;
  line-height: 1.6;
}
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 22px;
  background: var(--accent);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 600;
  transition: opacity 0.15s;
}
.btn-primary:hover { opacity: 0.88; }
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 22px;
  border: 1px solid var(--ink);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: none;
  transition: background 0.15s;
}
.btn-secondary:hover { background: var(--paper); }
.hero-img-wrap {
  position: relative;
  background: var(--paper);
  border: 1px solid var(--line);
  display: flex;
  align-items: stretch;
}
.hero-badge {
  position: absolute;
  top: 16px; left: 16px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  background: var(--accent);
  color: var(--bg);
  padding: 5px 9px;
  z-index: 1;
}
.hero-img-inner {
  flex: 1;
  min-height: 440px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
}

/* ── Stats ──────────────────────────────────────────────────────────────── */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  margin-bottom: 72px;
}
.stat-item { padding: 28px 24px; display: flex; flex-direction: column; gap: 6px; }
.stat-n {
  font-family: var(--font-display);
  font-size: 44px;
  line-height: 1;
  letter-spacing: -1px;
}
.stat-l {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--muted);
  text-transform: uppercase;
}

/* ── Products ───────────────────────────────────────────────────────────── */
.products-section { padding: 0 48px 72px; }
.products-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; }
.section-eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--muted);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.section-title {
  font-family: var(--font-display);
  font-size: 52px;
  margin: 0;
  letter-spacing: -1px;
  text-transform: uppercase;
  line-height: 1;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  row-gap: 28px;
}
.product-card {
  display: flex;
  flex-direction: column;
  background: var(--paper);
  border: 1px solid var(--line);
  cursor: pointer;
  transition: border-color 0.2s;
  position: relative;
  overflow: hidden;
}
.product-card:hover { border-color: var(--accent); }
.product-card:hover .card-add-overlay { opacity: 1; transform: translateY(0); }
.card-img-wrap { position: relative; overflow: hidden; }
.card-img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
.card-img-placeholder {
  width: 100%; aspect-ratio: 1;
  background: var(--line);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted);
}
.card-tag {
  position: absolute; top: 10px; left: 10px;
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
  background: var(--bg); color: var(--accent); padding: 4px 8px;
}
.card-hot {
  position: absolute; top: 10px; right: 10px;
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
  background: var(--accent); color: var(--bg); padding: 4px 8px;
}
.card-add-overlay {
  all: unset;
  position: absolute; left: 10px; right: 10px; bottom: 10px;
  background: var(--accent); color: var(--bg);
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
  padding: 10px 12px; text-align: center;
  opacity: 0; transform: translateY(6px);
  transition: all 0.2s;
  cursor: pointer; box-sizing: border-box;
}
.card-body { padding: 14px 16px 16px; }
.card-title-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
.card-name {
  font-family: var(--font-display);
  font-size: 18px; letter-spacing: 0.5px; text-transform: uppercase; line-height: 1; color: var(--ink);
}
.card-price {
  font-family: var(--font-mono); font-size: 13px; color: var(--accent);
  font-variant-numeric: tabular-nums; flex-shrink: 0;
}
.card-tags { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
.tag-chip {
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 1px; text-transform: uppercase;
  color: var(--muted); border: 1px solid var(--line); padding: 2px 6px;
}

/* ── Empty ──────────────────────────────────────────────────────────────── */
.empty { padding: 60px 0; text-align: center; font-family: var(--font-mono); }
.empty-head { font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
.empty p { color: var(--muted); font-size: 12px; margin: 6px 0; }
.empty code { background: var(--paper); padding: 2px 6px; font-family: var(--font-mono); font-size: 11px; }
.err { color: #FF4A2E; }

/* ── Callout ────────────────────────────────────────────────────────────── */
.callout {
  margin: 0 48px 72px;
  background: var(--accent);
  color: var(--bg);
  display: grid;
  grid-template-columns: 1.1fr 1fr;
}
.callout-text { padding: 48px 44px; display: flex; flex-direction: column; justify-content: space-between; }
.callout-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px; }
.callout-title {
  font-family: var(--font-display);
  font-size: clamp(48px, 6vw, 84px);
  line-height: 0.9; margin: 0 0 32px; letter-spacing: -1.5px; text-transform: uppercase;
}
.callout-sub { font-family: var(--font-mono); font-size: 14px; letter-spacing: 2px; font-weight: 400; }
.callout-btn {
  display: inline-flex; align-items: center;
  padding: 14px 22px; background: var(--bg); color: var(--accent);
  font-family: var(--font-mono); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;
  width: fit-content;
}
.callout-img {
  background: var(--line);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted);
  min-height: 300px;
}
</style>
