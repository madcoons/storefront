<script setup lang="ts">
const { itemCount, openCart } = useCart()
const { data: store } = useStore()
const storeName = computed(() => store.value?.name || 'OAKHAUS')
</script>

<template>
  <div class="oak-shell">
    <!-- Promo banner -->
    <div class="promo-banner">
      Free shipping over $80 · Spring collection now open
    </div>

    <!-- Sticky header -->
    <header class="site-header">
      <NuxtLink to="/" class="logo">{{ storeName }}</NuxtLink>

      <nav class="nav-center">
        <NuxtLink to="/">Shop</NuxtLink>
        <NuxtLink to="/">Plans</NuxtLink>
        <span>Journal</span>
        <span>About</span>
      </nav>

      <div class="nav-right">
        <button class="icon-btn" aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <circle cx="9" cy="9" r="5.5" /><path d="M13 13l4 4" />
          </svg>
        </button>
        <button class="icon-btn bag-btn" @click="openCart" aria-label="Open cart">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 7h12l-.8 10.2a1.5 1.5 0 01-1.5 1.3H6.3a1.5 1.5 0 01-1.5-1.3L4 7z" />
            <path d="M7 7V5a3 3 0 016 0v2" />
          </svg>
          <span v-if="itemCount > 0" class="cart-badge">{{ itemCount }}</span>
        </button>
      </div>
    </header>

    <!-- Page content -->
    <NuxtPage />

    <!-- Footer -->
    <footer class="site-footer">
      <div class="footer-brand">
        <div class="footer-logo">{{ storeName }}</div>
        <p class="footer-desc">Seasonal cooking and quiet apparel. Made slowly, worn daily.</p>
      </div>
      <div class="footer-col">
        <div class="footer-col-head">Shop</div>
        <span>Apparel</span><span>Plans</span><span>Books</span><span>Home</span>
      </div>
      <div class="footer-col">
        <div class="footer-col-head">Studio</div>
        <span>About</span><span>Journal</span><span>Press</span><span>Stockists</span>
      </div>
      <div class="footer-col">
        <div class="footer-col-head">Help</div>
        <span>Contact</span><span>Shipping</span><span>Returns</span><span>FAQ</span>
      </div>
      <div class="footer-copy">
        © {{ storeName }} · est. {{ new Date().getFullYear() }}
      </div>
    </footer>

    <CartDrawer />
  </div>
</template>

<style>
/* ── OAKHAUS global design tokens ─────────────────────────────────────── */
:root {
  --bg: #F2EBDE;
  --paper: #FFFBF3;
  --ink: #1F1B14;
  --muted: #7A6E55;
  --accent: #4F5E42;
  --line: #D9CFB8;
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-body: 'Manrope', system-ui, sans-serif;
  --font-mono: 'Manrope', system-ui, sans-serif;
}
*, *::before, *::after { box-sizing: border-box; }
html, body {
  margin: 0; padding: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.5;
}
a { color: inherit; text-decoration: none; }
button { font-family: var(--font-body); }
</style>

<style scoped>
.oak-shell { min-height: 100vh; display: flex; flex-direction: column; }

/* ── Promo banner ──────────────────────────────────────────────────────── */
.promo-banner {
  background: var(--ink);
  color: var(--paper);
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-align: center;
  padding: 9px 24px;
}

/* ── Header ────────────────────────────────────────────────────────────── */
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 56px;
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 100;
}
.logo {
  font-family: var(--font-display);
  font-size: 26px;
  letter-spacing: 4px;
  color: var(--ink);
}
.nav-center {
  display: flex;
  gap: 36px;
  font-size: 13px;
  letter-spacing: 0.4px;
}
.nav-center a, .nav-center span {
  cursor: pointer;
  border-bottom: 1px solid transparent;
  padding-bottom: 2px;
  transition: border-color 0.15s;
}
.nav-center a:hover, .nav-center span:hover { border-bottom-color: var(--ink); }
.nav-right { display: flex; gap: 18px; align-items: center; }
.icon-btn {
  all: unset; cursor: pointer; color: var(--ink);
  display: flex; align-items: center; position: relative;
}
.cart-badge {
  position: absolute; top: -4px; right: -6px;
  background: var(--accent); color: var(--paper);
  font-size: 10px; font-weight: 600;
  width: 16px; height: 16px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}

/* ── Footer ────────────────────────────────────────────────────────────── */
.site-footer {
  margin-top: auto;
  padding: 56px 56px 44px;
  border-top: 1px solid var(--line);
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 32px;
  font-size: 13px;
  color: var(--muted);
}
.footer-logo { font-family: var(--font-display); font-size: 22px; letter-spacing: 3px; color: var(--ink); margin-bottom: 12px; }
.footer-desc { max-width: 260px; line-height: 1.6; font-size: 13px; margin: 0; }
.footer-col { display: flex; flex-direction: column; gap: 8px; }
.footer-col-head { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--ink); margin-bottom: 4px; }
.footer-copy { grid-column: 1 / -1; border-top: 1px solid var(--line); padding-top: 16px; font-size: 11px; letter-spacing: 1px; }
</style>
