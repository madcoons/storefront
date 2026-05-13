<script setup lang="ts">
const { items, itemCount, totalAmount, isCartOpen, closeCart, removeItem, updateQuantity } = useCart()
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isCartOpen" class="overlay" @click.self="closeCart">
        <aside class="drawer">
          <header class="drawer-header">
            <div class="drawer-title">Your bag · {{ itemCount }}</div>
            <button class="close-btn" @click="closeCart" aria-label="Close cart">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </header>

          <div class="drawer-body">
            <div v-if="items.length === 0" class="empty">Your bag is quiet.</div>
            <div v-for="item in items" :key="item.variantId" class="cart-item">
              <div class="item-img-wrap">
                <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" class="item-img" />
                <div v-else class="item-img-ph" />
              </div>
              <div class="item-details">
                <div class="item-name">{{ item.title }}</div>
                <div class="item-meta">{{ item.attributesSummary ? `${item.attributesSummary} · ` : '' }}${{ item.price.toFixed(2) }}</div>
                <div class="qty-row">
                  <button class="qty-btn" @click="updateQuantity(item.variantId, item.quantity - 1)">−</button>
                  <span class="qty-val">{{ item.quantity }}</span>
                  <button class="qty-btn" @click="updateQuantity(item.variantId, item.quantity + 1)">+</button>
                </div>
              </div>
              <div class="item-right">
                <div class="item-total">${{ (item.price * item.quantity).toFixed(2) }}</div>
                <button class="remove-btn" @click="removeItem(item.variantId)">Remove</button>
              </div>
            </div>
          </div>

          <footer v-if="items.length > 0" class="drawer-footer">
            <div class="total-row">
              <span>Subtotal</span><span class="total-amt">${{ totalAmount.toFixed(2) }}</span>
            </div>
            <div class="total-row muted">
              <span>Shipping</span><span>Free over $80</span>
            </div>
            <NuxtLink to="/checkout" class="checkout-btn" @click="closeCart">
              Checkout — ${{ totalAmount.toFixed(2) }}
            </NuxtLink>
            <div class="payment-methods">Apple Pay · Shop Pay · Visa</div>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0;
  background: rgba(20, 16, 10, 0.4);
  z-index: 1000;
  display: flex; justify-content: flex-end;
}
.drawer {
  width: 420px; max-width: 100vw; height: 100%;
  background: var(--bg);
  box-shadow: -12px 0 40px rgba(0, 0, 0, 0.08);
  display: flex; flex-direction: column;
}
.drawer-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 22px 28px; border-bottom: 1px solid var(--line);
}
.drawer-title { font-family: var(--font-display); font-size: 22px; letter-spacing: 1px; }
.close-btn { all: unset; cursor: pointer; color: var(--ink); display: flex; align-items: center; }

.drawer-body { flex: 1; overflow-y: auto; padding: 12px 28px; }
.empty { padding: 60px 0; text-align: center; color: var(--muted); font-size: 14px; }
.cart-item {
  display: grid; grid-template-columns: 72px 1fr auto;
  gap: 14px; padding: 16px 0; border-bottom: 1px solid var(--line);
}
.item-img { width: 72px; height: 72px; object-fit: cover; display: block; border-radius: 2px; }
.item-img-ph { width: 72px; height: 72px; background: var(--line); border-radius: 2px; }
.item-name { font-family: var(--font-display); font-size: 16px; margin-bottom: 4px; line-height: 1.2; }
.item-meta { font-size: 12px; color: var(--muted); margin-bottom: 8px; }
.qty-row { display: inline-flex; align-items: center; border: 1px solid var(--line); }
.qty-btn {
  all: unset; cursor: pointer; color: var(--ink);
  width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center; font-size: 14px;
}
.qty-btn:hover { color: var(--accent); }
.qty-val { width: 22px; text-align: center; font-size: 12px; }
.item-right { text-align: right; }
.item-total { font-size: 14px; font-variant-numeric: tabular-nums; }
.remove-btn {
  all: unset; cursor: pointer; display: block; margin-top: 6px;
  font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted);
}
.remove-btn:hover { color: var(--ink); }

.drawer-footer { padding: 20px 28px 24px; border-top: 1px solid var(--line); }
.total-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
.total-row.muted { color: var(--muted); }
.total-amt { font-variant-numeric: tabular-nums; }
.checkout-btn {
  display: flex; align-items: center; justify-content: center;
  width: 100%; padding: 16px 24px; margin-top: 14px;
  background: var(--ink); color: var(--paper);
  font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
  text-decoration: none; box-sizing: border-box; transition: background 0.15s;
}
.checkout-btn:hover { background: var(--accent); }
.payment-methods {
  margin-top: 12px; text-align: center;
  font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted);
}

.drawer-enter-active, .drawer-leave-active { transition: opacity 0.3s ease; }
.drawer-enter-active .drawer, .drawer-leave-active .drawer { transition: transform 0.35s cubic-bezier(.2,.7,.3,1); }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from .drawer, .drawer-leave-to .drawer { transform: translateX(100%); }
</style>
