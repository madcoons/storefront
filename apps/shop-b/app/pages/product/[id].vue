<script setup lang="ts">
import type { PublicationMeta, PublicationVariantDto } from '@storefront/dam-client'

const route = useRoute()
const productId = Number(route.params.id)
const { damBaseUrl } = useRuntimeConfig().public
const { data: product, error } = await usePublication(productId)

const meta = computed<PublicationMeta | null>(() => {
  if (!product.value) return null
  return JSON.parse(product.value.metaValues)
})

const optionSelections = ref<Record<string, string>>({})

const optionChoices = computed(() => {
  if (!product.value) return []
  return product.value.options.map((opt) => {
    const values = new Set<string>()
    for (const item of product.value!.items) {
      const ov = item.optionValues.find((v) => v.code === opt.code)
      if (ov) values.add(ov.value)
    }
    return { name: opt.name, code: opt.code, values: [...values] }
  })
})

watch(optionChoices, (choices) => {
  const sel: Record<string, string> = {}
  for (const choice of choices) {
    if (choice.values.length > 0 && !optionSelections.value[choice.code]) {
      sel[choice.code] = choice.values[0]
    }
  }
  if (Object.keys(sel).length) {
    optionSelections.value = { ...optionSelections.value, ...sel }
  }
}, { immediate: true })

const selectedVariant = computed<PublicationVariantDto | null>(() => {
  if (!product.value) return null
  return (
    product.value.items.find((item) =>
      item.optionValues.every((ov) => optionSelections.value[ov.code] === ov.value),
    ) ?? product.value.items[0] ?? null
  )
})

const images = computed(() => {
  if (!product.value) return []
  return product.value.files.map((f) => ({
    uuid: f.uuid,
    url: `${damBaseUrl}/cdn/thumbs/design-publication-file/file/${f.uuid}.jpeg?width=800&type=image/webp`,
  }))
})

const activeImage = ref(0)
const qty = ref(1)

function attributeSummary(variant: PublicationVariantDto): string {
  return variant.optionValues.map((ov) => ov.value).join(' / ')
}

const { addItem, openCart } = useCart()

function addToCart() {
  if (!selectedVariant.value || !product.value || !meta.value) return
  const variant = selectedVariant.value
  for (let i = 0; i < qty.value; i++) {
    addItem({
      variantId: variant.id,
      podProductVariantId: variant.podProductVariantId ?? undefined,
      podProductPartnerId: variant.podProductPartnerId ?? undefined,
      publicationId: String(product.value.id),
      storeSlug: useRuntimeConfig().public.storeSlug,
      title: meta.value.title,
      price: variant.price,
      quantity: 1,
      imageUrl: images.value[0]?.url ?? null,
      isDigital: product.value.isDigital,
      attributesSummary: attributeSummary(variant),
    })
  }
  openCart()
}
</script>

<template>
  <main class="pdp">
    <div class="breadcrumb">
      <NuxtLink to="/">Home</NuxtLink>
      <span>/</span>
      <NuxtLink to="/">Shop</NuxtLink>
      <span>/</span>
      <span class="breadcrumb-current">{{ meta?.title || '...' }}</span>
    </div>

    <template v-if="product && meta">
      <div class="pdp-layout">
        <!-- Gallery -->
        <div class="gallery">
          <div class="main-img-wrap">
            <img v-if="images.length" :src="images[activeImage]?.url" :alt="meta.title" class="main-img" />
            <div v-else class="main-img-placeholder"><span>Product image</span></div>
          </div>
          <div class="thumbs">
            <button
              v-for="(img, i) in images.slice(0, 4)"
              :key="img.uuid"
              :class="['thumb', { active: i === activeImage }]"
              @click="activeImage = i"
            >
              <img :src="img.url" :alt="`View ${i + 1}`" />
            </button>
            <div v-for="i in Math.max(0, 4 - images.length)" :key="`ph-${i}`" class="thumb thumb-ph" />
          </div>
        </div>

        <!-- Info -->
        <div class="info">
          <div class="info-kind">{{ product.isDigital ? 'Digital · Instant access' : 'Physical product' }}</div>
          <h1 class="info-title">{{ meta.title }}</h1>
          <div class="price">${{ (selectedVariant?.price ?? meta.minPrice).toFixed(2) }}</div>
          <div class="stars">
            <span v-for="i in 5" :key="i" class="star">★</span>
            <span class="star-meta">4.9 · 218 reviews</span>
          </div>

          <p class="info-desc">{{ meta.description || 'No description available.' }}</p>

          <div v-if="product.isDigital && meta.tags.length" class="includes-box">
            <div class="includes-label">Includes</div>
            <div>{{ meta.tags.join(' · ') }}</div>
          </div>

          <div v-for="option in optionChoices" :key="option.code" class="option-group">
            <div class="option-label">
              {{ option.name }} · <span class="option-selected">{{ optionSelections[option.code] }}</span>
            </div>
            <div class="option-btns">
              <button
                v-for="val in option.values"
                :key="val"
                :class="['option-btn', { selected: optionSelections[option.code] === val }]"
                @click="optionSelections[option.code] = val"
              >{{ val }}</button>
            </div>
          </div>

          <div class="add-row">
            <div class="qty-wrap">
              <button class="qty-btn" @click="qty = Math.max(1, qty - 1)">−</button>
              <span class="qty-val">{{ qty }}</span>
              <button class="qty-btn" @click="qty++">+</button>
            </div>
            <button class="add-btn" @click="addToCart">
              Add to bag — ${{ ((selectedVariant?.price ?? meta.minPrice) * qty).toFixed(2) }}
            </button>
            <button class="wish-btn" aria-label="Wishlist">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 17s-6-3.8-6-8.2A3.8 3.8 0 0110 6a3.8 3.8 0 016 2.8C16 13.2 10 17 10 17z"/>
              </svg>
            </button>
          </div>

          <div class="detail-rows">
            <div class="detail-row">
              <span class="detail-key">Materials</span>
              <span>{{ product.isDigital ? 'PDF · Digital access' : '100% organic cotton · 280gsm' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-key">Shipping</span>
              <span>{{ product.isDigital ? 'Instant download' : 'Ships in 2 days · Free over $80' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-key">Returns</span>
              <span>30-day quiet return policy</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="not-found">
        <h1 class="not-found-head">Product not found</h1>
        <p v-if="error" class="err">{{ error.message }}</p>
        <NuxtLink to="/" class="btn-back">← Back to shop</NuxtLink>
      </div>
    </template>
  </main>
</template>

<style scoped>
.pdp { padding: 28px 56px 80px; }
.breadcrumb {
  display: flex; gap: 8px; align-items: center;
  font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
  color: var(--muted); margin-bottom: 28px;
}
.breadcrumb a:hover { color: var(--ink); }
.breadcrumb-current { color: var(--ink); }
.pdp-layout { display: grid; grid-template-columns: 1.2fr 1fr; gap: 56px; }

/* Gallery */
.gallery { display: flex; flex-direction: column; gap: 10px; }
.main-img-wrap { aspect-ratio: 4/5; overflow: hidden; border-radius: 2px; background: var(--line); }
.main-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.main-img-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted);
}
.thumbs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.thumb {
  aspect-ratio: 1; overflow: hidden; cursor: pointer; padding: 0;
  background: var(--line); border: 1px solid var(--line); border-radius: 2px; transition: border-color 0.15s;
}
.thumb.active { border-color: var(--ink); }
.thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.thumb-ph { background: var(--line); }

/* Info */
.info { padding-top: 8px; }
.info-kind { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
.info-title { font-family: var(--font-display); font-size: 44px; font-weight: 400; margin: 0; letter-spacing: -0.5px; line-height: 1.05; }
.price { font-size: 22px; margin-top: 18px; font-variant-numeric: tabular-nums; }
.stars { display: flex; align-items: center; gap: 2px; margin-top: 10px; color: var(--accent); }
.star { font-size: 12px; }
.star-meta { font-size: 12px; color: var(--muted); margin-left: 8px; }
.info-desc { margin-top: 28px; font-size: 15px; line-height: 1.65; color: var(--muted); max-width: 440px; }
.includes-box { margin-top: 24px; padding: 14px 16px; background: var(--paper); border: 1px solid var(--line); font-size: 13px; }
.includes-label { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }

.option-group { margin-top: 32px; }
.option-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
.option-selected { color: var(--ink); }
.option-btns { display: flex; gap: 8px; flex-wrap: wrap; }
.option-btn {
  all: unset; cursor: pointer;
  min-width: 48px; height: 44px; padding: 0 14px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 13px; border: 1px solid var(--line); color: var(--ink); transition: all 0.12s;
}
.option-btn:hover { border-color: var(--ink); }
.option-btn.selected { border-color: var(--ink); background: var(--ink); color: var(--paper); }

.add-row { display: flex; gap: 12px; margin-top: 32px; }
.qty-wrap { display: flex; align-items: center; border: 1px solid var(--line); height: 52px; }
.qty-btn {
  all: unset; cursor: pointer; color: var(--ink);
  width: 40px; height: 100%;
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.qty-btn:hover { color: var(--accent); }
.qty-val { width: 32px; text-align: center; font-size: 14px; font-variant-numeric: tabular-nums; }
.add-btn {
  all: unset; cursor: pointer; flex: 1; height: 52px;
  display: flex; align-items: center; justify-content: center;
  background: var(--ink); color: var(--paper);
  font-size: 12px; letter-spacing: 2px; text-transform: uppercase; transition: background 0.15s;
}
.add-btn:hover { background: var(--accent); }
.wish-btn {
  all: unset; cursor: pointer; width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--line); color: var(--ink); flex-shrink: 0;
}
.wish-btn:hover { border-color: var(--ink); }

.detail-rows { margin-top: 36px; border-top: 1px solid var(--line); }
.detail-row { display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--line); font-size: 13px; }
.detail-key { color: var(--muted); letter-spacing: 0.5px; }

.not-found { padding: 80px 0; text-align: center; }
.not-found-head { font-family: var(--font-display); font-size: 48px; font-weight: 400; margin: 0 0 16px; }
.btn-back { display: inline-flex; align-items: center; margin-top: 24px; border: 1px solid var(--ink); padding: 12px 24px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: var(--ink); }
.err { color: #b91c1c; }
</style>
