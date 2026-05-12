<script setup lang="ts">
const { storeSlug } = useRuntimeConfig().public
const { data: store, error } = await useStore()
</script>

<template>
  <main class="shop">
    <header>
      <small>shop-b · slug: <code>{{ storeSlug }}</code></small>
    </header>

    <template v-if="store">
      <h1>{{ store.name }}</h1>
      <p v-if="store.description">{{ store.description }}</p>
    </template>

    <template v-else>
      <h1>SHOP-B PLACEHOLDER</h1>
      <p>
        No store data yet. Set <code>NUXT_PUBLIC_STORE_SLUG</code>.
      </p>
      <p v-if="error" class="err">DAM fetch error: {{ error.message }}</p>
    </template>
  </main>
</template>

<style scoped>
/* Deliberately different visual identity from shop-a — proves the architecture: */
/* same backend, same data model, completely different frontend. */
.shop {
  min-height: 100vh;
  margin: 0;
  padding: 3rem 2rem;
  background: #0d0d0d;
  color: #f5f5f5;
  font-family: ui-monospace, 'SF Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
header small {
  color: #666;
  text-transform: none;
  letter-spacing: 0;
  font-size: 0.7rem;
}
h1 {
  font-size: 5rem;
  margin: 2rem 0;
  line-height: 0.9;
  border-top: 4px solid #f5f5f5;
  border-bottom: 4px solid #f5f5f5;
  padding: 1rem 0;
}
.err { color: #fca5a5; text-transform: none; letter-spacing: 0; }
</style>
