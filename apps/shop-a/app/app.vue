<script setup lang="ts">
const { itemCount, openCart } = useCart()
const { data: store } = useStore()
const storeName = computed(() => store.value?.name || 'VOLT/72')
</script>

<template>
  <div class="volt-shell">
    <!-- Promo ticker -->
    <div class="promo-ticker" aria-hidden="true">
      <div class="ticker-track">
        <span>▲ DROP 014 LIVE</span><span class="dot">·</span>
        <span>FREE SHIPPING OVER $100</span><span class="dot">·</span>
        <span>NEW PROGRAM — 24H LAUNCH</span><span class="dot">·</span>
        <span>▲ DROP 014 LIVE</span><span class="dot">·</span>
        <span>FREE SHIPPING OVER $100</span><span class="dot">·</span>
        <span>NEW PROGRAM — 24H LAUNCH</span><span class="dot">·</span>
      </div>
    </div>

    <!-- Sticky header -->
    <header class="site-header">
      <nav class="nav-left">
        <NuxtLink to="/">Programs</NuxtLink>
        <NuxtLink to="/">Apparel</NuxtLink>
        <NuxtLink to="/">Fuel</NuxtLink>
        <span>Drops</span>
      </nav>

      <NuxtLink to="/" class="logo">
        {{ storeName }}<span class="slash">/</span>
      </NuxtLink>

      <div class="nav-right">
        <span class="live-badge">
          <span class="live-dot" />
          LIVE
        </span>
        <button class="icon-btn" @click="openCart">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 4h2l1.5 9.5a1.5 1.5 0 001.5 1.3h7.2a1.5 1.5 0 001.5-1.2L18 7H6" />
            <circle cx="9" cy="17.5" r="1" /><circle cx="15" cy="17.5" r="1" />
          </svg>
          <span class="cart-count">[{{ String(itemCount).padStart(2, '0') }}]</span>
        </button>
      </div>
    </header>

    <!-- Page content -->
    <div class="page-wrap">
      <NuxtPage />
    </div>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="footer-brand">
        <div class="footer-logo">{{ storeName }}<span class="slash">/</span></div>
        <div class="footer-sub">Training programs · Technical apparel · Supplements</div>
      </div>
      <div class="footer-col">
        <div class="footer-col-head">Train</div>
        <span>Programs</span><span>Free WODs</span><span>App</span>
      </div>
      <div class="footer-col">
        <div class="footer-col-head">Wear</div>
        <span>Apparel</span><span>Gear</span><span>Drops</span>
      </div>
      <div class="footer-col">
        <div class="footer-col-head">Fuel</div>
        <span>Pre</span><span>Protein</span><span>Stack</span>
      </div>
      <div class="footer-col">
        <div class="footer-col-head">Co.</div>
        <span>About</span><span>Press</span><span>Contact</span>
      </div>
      <div class="footer-copy">
        <span>© {{ storeName }} · BUILD {{ new Date().getFullYear() }}</span>
        <span>SHIPPING WORLDWIDE · 192 COUNTRIES</span>
      </div>
    </footer>

    <CartDrawer />
  </div>
</template>

<style>
/* ── VOLT/72 global design tokens ─────────────────────────────────────── */
:root {
  --bg: #0A0A0B;
  --paper: #141416;
  --ink: #F5F5F0;
  --muted: #7A7A75;
  --accent: #D6FF3D;
  --line: #26262A;
  --font-display: 'Archivo Black', 'Arial Black', sans-serif;
  --font-body: 'Space Grotesk', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
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
.volt-shell { min-height: 100vh; display: flex; flex-direction: column; }
.page-wrap { max-width: 1440px; margin-inline: auto; width: 100%; }

/* ── Promo ticker ──────────────────────────────────────────────────────── */
.promo-ticker {
  background: var(--accent);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 8px 0;
  overflow: hidden;
  white-space: nowrap;
}
.ticker-track {
  display: inline-flex;
  gap: 28px;
  align-items: center;
  animation: ticker 24s linear infinite;
}
.dot { opacity: 0.5; }
@keyframes ticker {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* ── Header ────────────────────────────────────────────────────────────── */
.site-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 18px 48px;
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 100;
}
.nav-left {
  display: flex;
  gap: 22px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.nav-left a, .nav-left span { cursor: pointer; transition: color 0.15s; }
.nav-left a:hover { color: var(--accent); }
.logo {
  font-family: var(--font-display);
  font-size: 28px;
  letter-spacing: 1px;
  line-height: 1;
  color: var(--ink);
  text-align: center;
}
.slash { color: var(--accent); }
.nav-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 18px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.live-badge { display: flex; align-items: center; gap: 6px; color: var(--muted); }
.live-dot {
  width: 8px; height: 8px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(214, 255, 61, 0.2);
  display: inline-block;
}
.icon-btn {
  all: unset;
  cursor: pointer;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 6px;
}
.cart-count { color: var(--accent); }

/* ── Footer ────────────────────────────────────────────────────────────── */
.site-footer {
  margin-top: auto;
  padding: 48px 48px 40px;
  border-top: 1px solid var(--line);
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
  gap: 28px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
}
.footer-logo {
  font-family: var(--font-display);
  font-size: 26px;
  color: var(--ink);
  letter-spacing: 1px;
  text-transform: none;
  margin-bottom: 10px;
}
.footer-sub { font-size: 11px; letter-spacing: 0.5px; text-transform: none; }
.footer-col { display: flex; flex-direction: column; gap: 6px; text-transform: none; font-size: 12px; }
.footer-col-head { color: var(--ink); font-size: 11px; letter-spacing: 2px; margin-bottom: 6px; text-transform: uppercase; }
.footer-copy {
  grid-column: 1 / -1;
  border-top: 1px solid var(--line);
  padding-top: 14px;
  font-size: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
