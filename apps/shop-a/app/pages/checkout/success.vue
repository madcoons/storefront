<script setup lang="ts">
const { clearCart } = useCart()
onMounted(() => { clearCart() })
</script>

<template>
  <main class="success">
    <div class="success-inner">
      <div class="check-ring">✓</div>
      <div class="success-eyebrow">ORDER CONFIRMED</div>
      <h1 class="success-title">LOCKED IN.</h1>
      <p class="success-body">Your order has been placed. You'll receive a confirmation email shortly.</p>
      <NuxtLink to="/" class="continue-btn">← BACK TO SHOP</NuxtLink>
    </div>
  </main>
</template>

<style scoped>
.success {
  min-height: 60vh;
  display: flex; align-items: center; justify-content: center;
  padding: 4rem 2rem;
}
.success-inner { text-align: center; max-width: 480px; }
.check-ring {
  width: 72px; height: 72px;
  border: 2px solid var(--accent);
  color: var(--accent);
  font-size: 2rem;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 28px;
}
.success-eyebrow {
  font-family: var(--font-mono);
  font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
  color: var(--accent); margin-bottom: 12px;
}
.success-title {
  font-family: var(--font-display);
  font-size: 72px; letter-spacing: -1.5px; text-transform: uppercase;
  margin: 0 0 16px; line-height: 0.92;
}
.success-body { font-size: 15px; color: var(--muted); margin: 0 0 36px; line-height: 1.6; }
.continue-btn {
  display: inline-flex; align-items: center;
  padding: 14px 28px;
  background: var(--accent); color: var(--bg);
  font-family: var(--font-mono); font-size: 12px;
  letter-spacing: 2px; text-transform: uppercase; font-weight: 600;
  transition: opacity 0.15s;
}
.continue-btn:hover { opacity: 0.88; }
</style>
