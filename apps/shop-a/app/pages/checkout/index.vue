<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
import type { Stripe, StripeElements } from '@stripe/stripe-js'
import {
  estimateShipping,
  createCheckout,
  type StoreShippingAddressDto,
  type ShippingEstimateResultDto,
} from '@storefront/dam-client'

const { storeSlug, damBaseUrl } = useRuntimeConfig().public
const { items, totalAmount, clearCart } = useCart()
const router = useRouter()

if (items.value.length === 0) {
  await navigateTo('/')
}

const requiresShipping = computed(() => items.value.some((i) => !i.isDigital))

const email = ref('')
const shipping = reactive<StoreShippingAddressDto>({
  name: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
})

const shippingEstimate = ref<ShippingEstimateResultDto | null>(null)
const shippingLoading = ref(false)

async function fetchShippingEstimate() {
  if (!requiresShipping.value || !shipping.country) return
  shippingLoading.value = true
  shippingEstimate.value = await estimateShipping(
    storeSlug,
    {
      items: items.value.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      countryCode: shipping.country,
      shippingMethod: 'Standard',
    },
    { baseUrl: damBaseUrl },
  )
  shippingLoading.value = false
}

watch(() => shipping.country, fetchShippingEstimate, { immediate: true })

const shippingCost = computed(() => shippingEstimate.value?.totalShippingCost ?? 0)

const stripe = ref<Stripe | null>(null)
const elements = ref<StripeElements | null>(null)
const checkoutLoading = ref(false)
const checkoutError = ref('')
const paymentReady = ref(false)
const taxAmount = ref(0)
const finalTotal = ref(0)

async function initializePayment() {
  checkoutError.value = ''
  if (!email.value) { checkoutError.value = 'Email is required.'; return }
  if (requiresShipping.value && (!shipping.name || !shipping.addressLine1 || !shipping.city || !shipping.state || !shipping.postalCode || !shipping.country)) {
    checkoutError.value = 'Please fill in all required shipping fields.'
    return
  }
  checkoutLoading.value = true
  try {
    const result = await createCheckout(
      storeSlug,
      {
        items: items.value.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        currency: 'usd',
        shipping: requiresShipping.value ? shipping : undefined,
        shippingMethod: requiresShipping.value ? 'Standard' : undefined,
        buyerEmail: email.value,
      },
      { baseUrl: damBaseUrl },
    )
    taxAmount.value = result.taxAmountInCents / 100
    finalTotal.value = result.totalAmountInCents / 100
    stripe.value = await loadStripe(result.publishableKey)
    if (!stripe.value) { checkoutError.value = 'Failed to load payment processor.'; return }
    elements.value = stripe.value.elements({
      clientSecret: result.clientSecret,
      appearance: {
        theme: 'night',
        variables: { colorPrimary: '#D6FF3D', colorBackground: '#141416', colorText: '#F5F5F0', fontFamily: 'Space Grotesk, system-ui, sans-serif' },
      },
    })
    paymentReady.value = true
    await nextTick()
    const paymentEl = elements.value.create('payment')
    paymentEl.mount('#payment-element')
  } catch (err: any) {
    checkoutError.value = err.message || 'Checkout initialization failed.'
  } finally {
    checkoutLoading.value = false
  }
}

const paying = ref(false)

async function handlePay() {
  if (!stripe.value || !elements.value) return
  paying.value = true
  checkoutError.value = ''
  const { error } = await stripe.value.confirmPayment({
    elements: elements.value,
    confirmParams: { return_url: `${window.location.origin}/checkout/success`, receipt_email: email.value },
  })
  if (error) { checkoutError.value = error.message ?? 'Payment failed.'; paying.value = false }
  else { clearCart() }
}
</script>

<template>
  <main class="checkout">
    <NuxtLink to="/" class="back">← CONTINUE SHOPPING</NuxtLink>
    <h1 class="page-title">CHECKOUT</h1>

    <div class="checkout-layout">
      <!-- ── Form column ─────────────────────────────────────── -->
      <div class="form-col">
        <section class="section">
          <h2 class="section-head">CONTACT</h2>
          <input v-model="email" type="email" placeholder="Email address" class="input" />
        </section>

        <section v-if="requiresShipping" class="section">
          <h2 class="section-head">SHIPPING ADDRESS</h2>
          <input v-model="shipping.name" placeholder="Full name" class="input" />
          <input v-model="shipping.addressLine1" placeholder="Address line 1" class="input" />
          <input v-model="shipping.addressLine2" placeholder="Address line 2 (optional)" class="input" />
          <div class="row">
            <input v-model="shipping.city" placeholder="City" class="input" />
            <input v-model="shipping.state" placeholder="State" class="input" />
          </div>
          <div class="row">
            <input v-model="shipping.postalCode" placeholder="Postal code" class="input" />
            <select v-model="shipping.country" class="input">
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
            </select>
          </div>
        </section>

        <section v-else class="section">
          <h2 class="section-head">DELIVERY</h2>
          <p class="digital-note">Digital products — instant delivery, no shipping required.</p>
        </section>

        <section v-if="!paymentReady" class="section">
          <button class="action-btn" :disabled="checkoutLoading" @click="initializePayment">
            {{ checkoutLoading ? 'LOADING...' : 'CONTINUE TO PAYMENT →' }}
          </button>
        </section>

        <section v-if="paymentReady" class="section">
          <h2 class="section-head">PAYMENT</h2>
          <div id="payment-element" class="payment-el" />
          <button class="action-btn pay-btn" :disabled="paying" @click="handlePay">
            {{ paying ? 'PROCESSING...' : `PAY $${finalTotal.toFixed(2)} →` }}
          </button>
        </section>

        <p v-if="checkoutError" class="error">{{ checkoutError }}</p>
      </div>

      <!-- ── Order summary ───────────────────────────────────── -->
      <aside class="summary-col">
        <h2 class="section-head">ORDER SUMMARY</h2>
        <div v-for="item in items" :key="item.variantId" class="summary-item">
          <img v-if="item.imageUrl" :src="item.imageUrl" class="summary-img" :alt="item.title" />
          <div v-else class="summary-img-ph" />
          <div class="summary-details">
            <p class="summary-title">{{ item.title }}</p>
            <p class="summary-attrs">{{ item.attributesSummary }} × {{ item.quantity }}</p>
            <p class="summary-price">${{ (item.price * item.quantity).toFixed(2) }}</p>
          </div>
        </div>
        <div class="totals">
          <div class="total-row">
            <span>SUBTOTAL</span>
            <span>${{ totalAmount.toFixed(2) }}</span>
          </div>
          <div v-if="requiresShipping" class="total-row">
            <span>SHIPPING</span>
            <span v-if="shippingLoading">CALCULATING...</span>
            <span v-else>${{ shippingCost.toFixed(2) }}</span>
          </div>
          <div v-if="taxAmount > 0" class="total-row">
            <span>TAX</span>
            <span>${{ taxAmount.toFixed(2) }}</span>
          </div>
          <div class="total-row total-final">
            <span>TOTAL</span>
            <span class="accent">
              {{ paymentReady ? `$${finalTotal.toFixed(2)}` : `$${(totalAmount + shippingCost).toFixed(2)}` }}
            </span>
          </div>
        </div>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.checkout {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 48px 72px;
}
.back {
  display: inline-block; margin-bottom: 16px;
  font-family: var(--font-mono); font-size: 11px;
  letter-spacing: 2px; text-transform: uppercase; color: var(--muted);
  transition: color 0.15s;
}
.back:hover { color: var(--accent); }
.page-title {
  font-family: var(--font-display);
  font-size: 72px; letter-spacing: -1.5px;
  text-transform: uppercase; margin: 0 0 40px;
  line-height: 0.92;
}
.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 48px;
  align-items: start;
}
@media (max-width: 768px) {
  .checkout-layout { grid-template-columns: 1fr; }
  .summary-col { order: -1; }
}

.section { margin-bottom: 32px; }
.section-head {
  font-family: var(--font-mono);
  font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
  color: var(--muted); margin: 0 0 16px;
}
.input {
  display: block; width: 100%;
  padding: 12px 14px;
  background: var(--paper);
  border: 1px solid var(--line);
  color: var(--ink);
  font-family: var(--font-body); font-size: 14px;
  margin-bottom: 8px; box-sizing: border-box;
  outline: none; transition: border-color 0.15s;
}
.input:focus { border-color: var(--accent); }
.input option { background: var(--paper); }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.digital-note { font-size: 14px; color: var(--muted); margin: 0; }

.action-btn {
  width: 100%;
  padding: 16px;
  background: var(--accent); color: var(--bg);
  border: none; cursor: pointer;
  font-family: var(--font-mono); font-size: 13px;
  letter-spacing: 2px; text-transform: uppercase; font-weight: 600;
  transition: opacity 0.15s;
}
.action-btn:hover:not(:disabled) { opacity: 0.88; }
.action-btn:disabled { background: var(--muted); cursor: not-allowed; }
.pay-btn { margin-top: 16px; }
.payment-el { margin-bottom: 8px; }
.error { color: #FF4A2E; font-family: var(--font-mono); font-size: 12px; letter-spacing: 1px; margin-top: 8px; }

/* Summary */
.summary-col {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: 24px;
  position: sticky;
  top: 120px;
}
.summary-item {
  display: flex; gap: 12px; margin-bottom: 16px;
  padding-bottom: 16px; border-bottom: 1px solid var(--line);
}
.summary-item:last-of-type { border-bottom: none; margin-bottom: 0; }
.summary-img { width: 56px; height: 56px; object-fit: cover; flex-shrink: 0; }
.summary-img-ph { width: 56px; height: 56px; background: var(--line); flex-shrink: 0; }
.summary-details { flex: 1; min-width: 0; }
.summary-title {
  font-family: var(--font-display); font-size: 14px; text-transform: uppercase;
  margin: 0 0 2px; line-height: 1.2; overflow: hidden;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
}
.summary-attrs { font-family: var(--font-mono); font-size: 11px; color: var(--muted); margin: 0; letter-spacing: 1px; }
.summary-price { font-family: var(--font-mono); font-size: 13px; color: var(--accent); margin: 4px 0 0; }
.totals { border-top: 1px solid var(--line); padding-top: 16px; margin-top: 8px; }
.total-row {
  display: flex; justify-content: space-between;
  font-family: var(--font-mono); font-size: 11px;
  letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted);
  margin-bottom: 6px;
}
.total-final {
  color: var(--ink); font-size: 13px;
  padding-top: 10px; margin-top: 6px;
  border-top: 1px solid var(--line);
}
.accent { color: var(--accent); }
</style>
