export interface CartItem {
  variantId: number
  podProductVariantId?: number
  podProductPartnerId?: number
  publicationId: string
  storeSlug: string
  title: string
  price: number
  quantity: number
  imageUrl: string | null
  isDigital: boolean
  attributesSummary: string
}

const STORAGE_KEY = 'store_cart'

const items = ref<CartItem[]>([])
const isCartOpen = ref(false)

// Load from localStorage on client
if (import.meta.client) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) items.value = JSON.parse(saved)
  } catch {}

  watch(items, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })
}

export function useCart() {
  const itemCount = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0),
  )

  const totalAmount = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0),
  )

  const currentStoreSlug = computed(() =>
    items.value[0]?.storeSlug ?? null,
  )

  function addItem(item: CartItem) {
    // Enforce single-store cart
    if (currentStoreSlug.value && currentStoreSlug.value !== item.storeSlug) {
      items.value = []
    }

    const existing = items.value.find((i) => i.variantId === item.variantId)
    if (existing) {
      existing.quantity += item.quantity
    } else {
      items.value.push({ ...item })
    }
  }

  function removeItem(variantId: number) {
    items.value = items.value.filter((i) => i.variantId !== variantId)
  }

  function updateQuantity(variantId: number, quantity: number) {
    const item = items.value.find((i) => i.variantId === variantId)
    if (item) {
      if (quantity <= 0) {
        removeItem(variantId)
      } else {
        item.quantity = quantity
      }
    }
  }

  function clearCart() {
    items.value = []
  }

  function openCart() {
    isCartOpen.value = true
  }

  function closeCart() {
    isCartOpen.value = false
  }

  function toggleCart() {
    isCartOpen.value = !isCartOpen.value
  }

  return {
    items: readonly(items),
    itemCount,
    totalAmount,
    currentStoreSlug,
    isCartOpen: readonly(isCartOpen),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  }
}
