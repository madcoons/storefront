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
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <NuxtLink to="/">HOME</NuxtLink>
      <span>/</span>
      <NuxtLink to="/">SHOP</NuxtLink>
      <span>/</span>
      <span class="breadcrumb-current">{{ meta?.title?.toUpperCase() || '...' }}</span>
    </div>

    <template v-if="product && meta">
      <div class="pdp-layout">
        <!-- ── Gallery ─────────────────────────────────────────── -->
        <div class="gallery">
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
          <div class="main-img-wrap">
            <img v-if="images.length" :src="images[activeImage]?.url" :alt="meta.title" class="main-img" />
            <div v-else class="main-img-placeholder"><span>PRODUCT IMAGE</span></div>
          </div>
        </div>

        <!-- ── Info ───────────────────────────────────────────── -->
        <div class="info">
          <div class="info-kind">
            {{ product.isDigital ? 'DIGITAL PROGRAM' : 'PHYSICAL PRODUCT' }} · SKU {{ product.id }}
          </div>
          <h1 class="info-title">{{ meta.title.toUpperCase() }}</h1>

          <div class="price-row">
            <div class="price">${{ (selectedVariant?.price ?? meta.minPrice).toFixed(2) }}</div>
            <div class="price-note">/ one-time · lifetime access</div>
          </div>

          <p class="info-desc">{{ meta.description || 'No description available.' }}</p>

          <!-- Tags as program stats -->
          <div v-if="meta.tags.length" class="program-stats">
            <div v-for="tag in meta.tags.slice(0, 3)" :key="tag" class="program-stat">
              <div class="ps-label">{{ tag }}</div>
            </div>
          </div>

          <!-- Variant selectors -->
          <div v-for="option in optionChoices" :key="option.code" class="option-group">
            <div class="option-label">
              <span>{{ option.name.toUpperCase() }}</span>
              <span class="option-selected">{{ optionSelections[option.code] }}</span>
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

          <!-- Add to bag -->
          <div class="add-row">
            <div class="qty-wrap">
              <button class="qty-btn" @click="qty = Math.max(1, qty - 1)">−</button>
              <span class="qty-val">{{ qty }}</span>
              <button class="qty-btn" @click="qty++">+</button>
            </div>
            <button class="add-btn" @click="addToCart">
              + ADD TO BAG · ${{ ((selectedVariant?.price ?? meta.minPrice) * qty).toFixed(2) }}
            </button>
          </div>

          <!-- Detail strip -->
          <div class="detail-strip">
            <div class="detail-item">
              <div class="detail-label">SHIPS</div>
              <div class="detail-val">{{ product.isDigital ? 'INSTANT' : '48H · FREE > $100' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">RETURNS</div>
              <div class="detail-val">14 DAYS · NO Q's</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">RATED</div>
              <div class="detail-val accent">★ 4.9</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="not-found">
        <div class="not-found-head">PRODUCT NOT FOUND</div>
        <p v-if="error" class="err">{{ error.message }}</p>
        <NuxtLink to="/" class="btn-back">← RETURN TO SHOP</NuxtLink>
      </div>
    </template>
  </main>
</template>

<style scoped>
.pdp { padding: 32px 48px 72px; }

.breadcrumb {
  display: flex; gap: 8px; align-items: center;
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px;
  text-transform: uppercase; color: var(--muted); margin-bottom: 32px;
}
.breadcrumb a:hover { color: var(--accent); }
.breadcrumb-current { color: var(--ink); }

.pdp-layout {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 48px;
}

/* ── Gallery ──────────────────────────────────────────────────────────── */
.gallery { display: grid; grid-template-columns: 70px 1fr; gap: 10px; }
.thumbs { display: flex; flex-direction: column; gap: 10px; }
.thumb {
  width: 70px; height: 70px;
  border: 1px solid var(--line);
  overflow: hidden; cursor: pointer; padding: 0;
  background: var(--paper); flex-shrink: 0;
}
.thumb.active { border-color: var(--accent); border-width: 2px; }
.thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.thumb-ph { background: var(--line); }
.main-img-wrap { aspect-ratio: 4/5; overflow: hidden; background: var(--paper); border: 1px solid var(--line); }
.main-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.main-img-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted);
}

/* ── Info ─────────────────────────────────────────────────────────────── */
.info { padding-top: 8px; }
.info-kind {
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px;
  text-transform: uppercase; color: var(--accent); margin-bottom: 16px;
}
.info-title {
  font-family: var(--font-display);
  font-size: clamp(40px, 5vw, 64px); line-height: 0.92;
  margin: 0; letter-spacing: -1.5px; text-transform: uppercase;
}
.price-row {
  display: flex; align-items: baseline; gap: 16px;
  margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--line);
}
.price { font-family: var(--font-display); font-size: 44px; color: var(--accent); line-height: 1; letter-spacing: -1px; }
.price-note { font-family: var(--font-mono); font-size: 11px; letter-spacing: 1.5px; color: var(--muted); text-transform: uppercase; }
.info-desc { margin-top: 20px; font-size: 14px; line-height: 1.6; color: var(--muted); max-width: 480px; }

.program-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 24px; }
.program-stat { padding: 14px 12px; background: var(--paper); border: 1px solid var(--line); }
.ps-label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 1.5px; color: var(--muted); text-transform: uppercase; }

/* Variants */
.option-group { margin-top: 28px; }
.option-label {
  display: flex; justify-content: space-between;
  font-family: var(--font-mono); font-size: 11px;
  letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px;
}
.option-selected { color: var(--accent); }
.option-btns { display: flex; gap: 8px; flex-wrap: wrap; }
.option-btn {
  all: unset; cursor: pointer;
  min-width: 52px; padding: 12px 16px; text-align: center;
  font-family: var(--font-mono); font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase;
  border: 1px solid var(--line); color: var(--ink); transition: all 0.15s;
}
.option-btn:hover { border-color: var(--ink); }
.option-btn.selected { border-color: var(--accent); background: var(--accent); color: var(--bg); }

/* Add row */
.add-row { display: flex; gap: 8px; margin-top: 28px; }
.qty-wrap { display: flex; align-items: center; border: 1px solid var(--line); height: 52px; }
.qty-btn {
  all: unset; cursor: pointer; color: var(--ink);
  width: 40px; height: 100%;
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.qty-btn:hover { color: var(--accent); }
.qty-val { width: 28px; text-align: center; font-family: var(--font-mono); font-size: 14px; }
.add-btn {
  all: unset; cursor: pointer; flex: 1; height: 52px;
  display: flex; align-items: center; justify-content: center;
  background: var(--accent); color: var(--bg);
  font-family: var(--font-mono); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;
  transition: opacity 0.15s;
}
.add-btn:hover { opacity: 0.88; }

/* Detail strip */
.detail-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 28px; }
.detail-item { border-top: 1px solid var(--line); padding-top: 12px; }
.detail-label { font-family: var(--font-mono); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink); margin-bottom: 4px; }
.detail-val { font-family: var(--font-mono); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }
.detail-val.accent { color: var(--accent); }

/* Not found */
.not-found { padding: 80px 0; text-align: center; }
.not-found-head { font-family: var(--font-display); font-size: 48px; letter-spacing: -1px; text-transform: uppercase; margin-bottom: 16px; }
.btn-back {
  display: inline-flex; align-items: center; margin-top: 24px;
  font-family: var(--font-mono); font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
  border: 1px solid var(--ink); padding: 12px 20px; color: var(--ink);
}
.err { color: #FF4A2E; }
</style>
