<script setup lang="ts">
const { clearCart } = useCart()
onMounted(() => { clearCart() })
</script>

<template>
  <main class="success">
    <div class="success-inner">
      <div class="check-mark">✓</div>
      <div class="success-eyebrow">Order confirmed</div>
      <h1 class="success-title">Thank you.</h1>
      <p class="success-body">Your order has been placed. You'll receive a confirmation email shortly.</p>
      <NuxtLink to="/" class="continue-btn">← Back to shop</NuxtLink>
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
.check-mark {
  width: 64px; height: 64px;
  border: 1px solid var(--accent);
  color: var(--accent);
  font-size: 1.75rem;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 28px;
  border-radius: 50%;
}
.success-eyebrow {
  font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
  color: var(--muted); margin-bottom: 12px;
}
.success-title {
  font-family: var(--font-display);
  font-size: 64px; font-weight: 400; letter-spacing: -1px;
  margin: 0 0 16px; line-height: 1.05;
}
.success-body { font-size: 15px; color: var(--muted); margin: 0 0 36px; line-height: 1.6; }
.continue-btn {
  display: inline-flex; align-items: center;
  padding: 14px 28px;
  background: var(--ink); color: var(--paper);
  font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
  transition: background 0.15s;
}
.continue-btn:hover { background: var(--accent); }
</style>
