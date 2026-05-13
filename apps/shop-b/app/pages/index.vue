<script setup lang="ts">
import type { PublicationMeta } from '@storefront/dam-client'

const { data: store, error } = await useStore()
const { data: publications } = await usePublications()

function parseMeta(raw: string): PublicationMeta {
  return JSON.parse(raw)
}

function formatPrice(min: number, max: number): string {
  if (min === max) return `$${min.toFixed(2)}`
  return `$${min.toFixed(2)} – $${max.toFixed(2)}`
}

function imageUrl(uuid: string): string {
  const { damBaseUrl } = useRuntimeConfig().public
  return `${damBaseUrl}/cdn/thumbs/design-publication-file/file/${uuid}.jpeg?width=800&type=image/webp`
}

const storeName = computed(() => store.value?.name || 'OAKHAUS')
</script>

<template>
  <main>
    <!-- ── Hero ─────────────────────────────────────────────────────────── -->
    <section class="hero">
      <div class="hero-text">
        <div class="hero-eyebrow">Spring Volume · 01</div>
        <h1 class="hero-headline">
          Eat seasonally.<br />
          <em class="accent">Move gently.</em>
        </h1>
        <p class="hero-desc">
          {{ store?.description || 'Thoughtful products for a slower, more intentional life.' }}
        </p>
        <div class="hero-actions">
          <NuxtLink
            v-if="publications?.items?.[0]"
            :to="`/product/${publications.items[0].id}`"
            class="btn-primary"
          >
            Begin the plan
          </NuxtLink>
          <NuxtLink to="/" class="btn-secondary">
            Shop the shelf
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </NuxtLink>
        </div>
      </div>
      <div class="hero-img-wrap">
        <div class="hero-img-inner"><span>Hero image</span></div>
        <div class="hero-caption">Photographed in Vermont · Spring</div>
      </div>
    </section>

    <!-- ── Products ──────────────────────────────────────────────────────── -->
    <section class="products-section">
      <div class="products-header">
        <h2 class="products-title">On the shelf this week</h2>
        <NuxtLink to="/" class="see-all">
          See all
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </NuxtLink>
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
              <div v-else class="card-img-placeholder"><span>Product image</span></div>
              <div class="card-kind-tag">{{ pub.isDigital ? 'Digital' : 'Physical' }}</div>
              <button class="card-add-btn" @click.prevent="() => {}">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
                  <path d="M7 2v10M2 7h10" />
                </svg>
              </button>
            </div>
            <div class="card-body">
              <div class="card-title-row">
                <div class="card-name">
                  {{ String(i + 1).padStart(2, '0') }}.&nbsp;{{ parseMeta(pub.metaValues).title }}
                </div>
                <div class="card-price">{{ formatPrice(parseMeta(pub.metaValues).minPrice, parseMeta(pub.metaValues).maxPrice) }}</div>
              </div>
              <div v-if="parseMeta(pub.metaValues).tags.length" class="card-sub">
                {{ parseMeta(pub.metaValues).tags.slice(0, 2).join(' · ') }}
              </div>
            </div>
          </NuxtLink>
        </div>
      </template>

      <div v-else-if="!store" class="empty">
        <h3 class="empty-head">No store connected</h3>
        <p>Configure <code>NUXT_PUBLIC_STORE_SLUG</code> and <code>NUXT_PUBLIC_DAM_BASE_URL</code>.</p>
        <p v-if="error" class="err">{{ error.message }}</p>
      </div>
      <div v-else class="empty">
        <h3 class="empty-head">The shelf is empty</h3>
        <p>Products will appear here once published in the DAM.</p>
      </div>
    </section>

    <!-- ── Editorial quote block ─────────────────────────────────────────── -->
    <section class="editorial">
      <div class="editorial-img"><span>Portrait</span></div>
      <div class="editorial-text">
        <div class="editorial-eyebrow">From the kitchen · 03</div>
        <blockquote class="editorial-quote">
          "I make things the way I make a meal —<br />
          <em class="accent">slowly, with two hands,</em> and only when I mean it."
        </blockquote>
        <div class="editorial-attr">— {{ storeName }}, founder</div>
        <NuxtLink to="/" class="btn-secondary" style="margin-top: 32px;">
          Read the journal
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </NuxtLink>
      </div>
    </section>

    <!-- ── Newsletter ─────────────────────────────────────────────────────── -->
    <section class="newsletter">
      <h3 class="newsletter-title">A letter on Sundays.</h3>
      <p class="newsletter-desc">One recipe, one note, one quiet thing. No spam, no urgency.</p>
      <form class="newsletter-form" @submit.prevent>
        <input placeholder="you@home.com" type="email" class="newsletter-input" />
        <button type="submit" class="newsletter-btn">Subscribe →</button>
      </form>
    </section>
  </main>
</template>

<style scoped>
/* ── Hero ───────────────────────────────────────────────────────────────── */
.hero {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  padding: 64px 56px 80px;
  gap: 56px;
  align-items: center;
}
.hero-eyebrow {
  font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
  color: var(--muted); margin-bottom: 28px;
}
.hero-headline {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(52px, 6vw, 76px);
  line-height: 1.02; letter-spacing: -1px;
  margin: 0 0 28px;
}
.accent { font-style: italic; color: var(--accent); }
.hero-desc { font-size: 16px; line-height: 1.6; color: var(--muted); max-width: 420px; margin: 0 0 36px; }
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 14px 24px;
  background: var(--ink); color: var(--paper);
  font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
  transition: background 0.15s;
}
.btn-primary:hover { background: var(--accent); }
.btn-secondary {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 14px 24px;
  border: 1px solid var(--ink); color: var(--ink);
  font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
  background: none; cursor: pointer;
  transition: background 0.15s;
}
.btn-secondary:hover { background: var(--paper); }
.hero-img-wrap { position: relative; }
.hero-img-inner {
  aspect-ratio: 4/5;
  background: var(--line);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted);
  border-radius: 2px;
}
.hero-caption {
  position: absolute; bottom: 20px; left: 20px;
  background: var(--paper); color: var(--ink);
  padding: 8px 12px; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
}

/* ── Products ───────────────────────────────────────────────────────────── */
.products-section { padding: 0 56px 80px; }
.products-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 28px; }
.products-title { font-family: var(--font-display); font-size: 32px; font-weight: 400; margin: 0; letter-spacing: -0.3px; }
.see-all {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: var(--muted); letter-spacing: 0.5px; cursor: pointer;
}
.see-all:hover { color: var(--ink); }

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  row-gap: 40px;
}
.product-card { display: flex; flex-direction: column; gap: 14px; cursor: pointer; }
.product-card:hover .card-add-btn { opacity: 1; transform: translateY(0); }
.card-img-wrap { position: relative; }
.card-img { width: 100%; aspect-ratio: 4/5; object-fit: cover; display: block; border-radius: 2px; }
.card-img-placeholder {
  width: 100%; aspect-ratio: 4/5;
  background: var(--line); border-radius: 2px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted);
}
.card-kind-tag {
  position: absolute; top: 12px; left: 12px;
  background: var(--paper); color: var(--ink);
  font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; padding: 5px 8px;
}
.card-add-btn {
  position: absolute; bottom: 12px; right: 12px;
  background: var(--ink); color: var(--paper);
  border: none; cursor: pointer;
  width: 34px; height: 34px; border-radius: 17px;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transform: translateY(6px);
  transition: all 0.2s;
}
.card-body { }
.card-title-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
.card-name { font-family: var(--font-display); font-size: 19px; font-weight: 400; letter-spacing: -0.2px; color: var(--ink); }
.card-price { font-size: 14px; color: var(--muted); font-variant-numeric: tabular-nums; flex-shrink: 0; }
.card-sub { font-size: 12px; color: var(--muted); letter-spacing: 0.3px; margin-top: 4px; }

/* ── Empty ──────────────────────────────────────────────────────────────── */
.empty { padding: 60px 0; text-align: center; }
.empty-head { font-family: var(--font-display); font-size: 28px; font-weight: 400; margin: 0 0 12px; }
.empty p { color: var(--muted); font-size: 14px; margin: 6px 0; }
.empty code { background: var(--line); padding: 2px 6px; font-size: 12px; border-radius: 2px; }
.err { color: #b91c1c; }

/* ── Editorial ──────────────────────────────────────────────────────────── */
.editorial {
  padding: 80px 56px;
  background: var(--paper);
  display: grid; grid-template-columns: 1fr 1.2fr; gap: 64px; align-items: center;
}
.editorial-img {
  aspect-ratio: 4/5;
  background: var(--line); border-radius: 2px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted);
}
.editorial-eyebrow { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 20px; }
.editorial-quote {
  font-family: var(--font-display);
  font-size: clamp(28px, 3vw, 42px);
  line-height: 1.15; font-weight: 400; letter-spacing: -0.5px;
  margin: 0 0 20px;
}
.editorial-attr { font-size: 13px; letter-spacing: 1px; color: var(--muted); }

/* ── Newsletter ─────────────────────────────────────────────────────────── */
.newsletter {
  padding: 80px 56px;
  text-align: center;
  max-width: 560px;
  margin: 0 auto;
}
.newsletter-title { font-family: var(--font-display); font-size: 36px; font-weight: 400; margin: 0 0 12px; letter-spacing: -0.4px; }
.newsletter-desc { color: var(--muted); margin: 0 0 24px; }
.newsletter-form {
  display: flex; border-bottom: 1px solid var(--ink);
}
.newsletter-input {
  flex: 1; border: none; outline: none;
  background: transparent; padding: 12px 4px;
  font-size: 15px; font-family: var(--font-body); color: var(--ink);
}
.newsletter-input::placeholder { color: var(--muted); }
.newsletter-btn {
  all: unset; cursor: pointer;
  padding: 12px 4px; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: var(--ink);
}
</style>
