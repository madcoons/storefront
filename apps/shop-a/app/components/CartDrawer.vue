<script setup lang="ts">
const { items, itemCount, totalAmount, isCartOpen, closeCart, removeItem, updateQuantity } = useCart()
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isCartOpen" class="overlay" @click.self="closeCart">
        <aside class="drawer">
          <!-- Header -->
          <header class="drawer-header">
            <div class="drawer-title">
              BAG <span class="count">[{{ String(itemCount).padStart(2, '0') }}]</span>
            </div>
            <button class="close-btn" @click="closeCart" aria-label="Close cart">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </header>

          <!-- Body -->
          <div class="drawer-body">
            <div v-if="items.length === 0" class="empty">
              EMPTY · GO GET SOME →
            </div>
            <div v-for="item in items" :key="item.variantId" class="cart-item">
              <div class="item-img-wrap">
                <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" class="item-img" />
                <div v-else class="item-img-ph" />
              </div>
              <div class="item-details">
                <div class="item-name">{{ item.title }}</div>
                <div class="item-meta">
                  {{ item.attributesSummary ? `${item.attributesSummary} · ` : '' }}${{ item.price.toFixed(2) }}
                </div>
                <div class="qty-row">
                  <button class="qty-btn" @click="updateQuantity(item.variantId, item.quantity - 1)">−</button>
                  <span class="qty-val">{{ item.quantity }}</span>
                  <button class="qty-btn" @click="updateQuantity(item.variantId, item.quantity + 1)">+</button>
                </div>
              </div>
              <div class="item-right">
                <div class="item-total">${{ (item.price * item.quantity).toFixed(2) }}</div>
                <button class="remove-btn" @click="removeItem(item.variantId)">REMOVE</button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <footer v-if="items.length > 0" class="drawer-footer">
            <div class="total-row">
              <span>SUBTOTAL</span>
              <span class="total-amt">${{ totalAmount.toFixed(2) }}</span>
            </div>
            <div class="total-row muted">
              <span>SHIP</span><span>FREE &gt; $100</span>
            </div>
            <NuxtLink to="/checkout" class="checkout-btn" @click="closeCart">
              CHECKOUT · ${{ totalAmount.toFixed(2) }} →
            </NuxtLink>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex; justify-content: flex-end;
}
.drawer {
  width: 420px; max-width: 100vw; height: 100%;
  background: var(--paper);
  border-left: 1px solid var(--line);
  display: flex; flex-direction: column;
}

/* Header */
.drawer-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--line);
}
.drawer-title {
  font-family: var(--font-display);
  font-size: 22px; letter-spacing: 1px; text-transform: uppercase;
}
.count { color: var(--accent); font-family: var(--font-mono); font-size: 14px; }
.close-btn { all: unset; cursor: pointer; color: var(--ink); display: flex; align-items: center; }

/* Body */
.drawer-body { flex: 1; overflow-y: auto; }
.empty {
  padding: 60px 24px; text-align: center;
  font-family: var(--font-mono); font-size: 12px;
  letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted);
}
.cart-item {
  display: grid; grid-template-columns: 72px 1fr auto;
  gap: 14px; padding: 16px 24px;
  border-bottom: 1px solid var(--line);
}
.item-img { width: 72px; height: 72px; object-fit: cover; display: block; }
.item-img-ph { width: 72px; height: 72px; background: var(--line); }
.item-name {
  font-family: var(--font-display);
  font-size: 15px; letter-spacing: 0.5px; text-transform: uppercase; line-height: 1.2; margin-bottom: 4px;
}
.item-meta {
  font-family: var(--font-mono); font-size: 11px;
  letter-spacing: 1px; color: var(--muted); text-transform: uppercase; margin-bottom: 8px;
}
.qty-row { display: inline-flex; align-items: center; border: 1px solid var(--line); }
.qty-btn {
  all: unset; cursor: pointer; color: var(--ink);
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center; font-size: 14px;
}
.qty-btn:hover { color: var(--accent); }
.qty-val { width: 22px; text-align: center; font-family: var(--font-mono); font-size: 11px; }
.item-right { text-align: right; }
.item-total { font-family: var(--font-mono); font-size: 14px; color: var(--accent); }
.remove-btn {
  all: unset; cursor: pointer; display: block; margin-top: 6px;
  font-family: var(--font-mono); font-size: 10px;
  letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted);
}
.remove-btn:hover { color: var(--ink); }

/* Footer */
.drawer-footer { padding: 20px 24px 22px; border-top: 1px solid var(--line); }
.total-row {
  display: flex; justify-content: space-between;
  font-family: var(--font-mono); font-size: 11px;
  letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 4px;
}
.total-row:not(.muted) { color: var(--ink); }
.total-row.muted { color: var(--muted); }
.total-amt { color: var(--ink); }
.checkout-btn {
  display: flex; align-items: center; justify-content: center;
  width: 100%; padding: 16px 22px; margin-top: 14px;
  background: var(--accent); color: var(--bg);
  font-family: var(--font-mono); font-size: 13px;
  letter-spacing: 2px; text-transform: uppercase; font-weight: 600;
  text-decoration: none; box-sizing: border-box;
  transition: opacity 0.15s;
}
.checkout-btn:hover { opacity: 0.88; }

/* Transition */
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.3s ease; }
.drawer-enter-active .drawer, .drawer-leave-active .drawer { transition: transform 0.35s cubic-bezier(.2,.7,.3,1); }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from .drawer, .drawer-leave-to .drawer { transform: translateX(100%); }
</style>
