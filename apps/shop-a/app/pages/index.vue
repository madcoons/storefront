<script setup lang="ts">
const { storeSlug } = useRuntimeConfig().public
const { data: store, error } = await useStore()
</script>

<template>
  <main class="shop">
    <header>
      <small>shop-a · slug: <code>{{ storeSlug }}</code></small>
    </header>

    <template v-if="store">
      <h1>{{ store.name }}</h1>
      <p v-if="store.description">{{ store.description }}</p>
    </template>

    <template v-else>
      <h1>shop-a (placeholder)</h1>
      <p>
        No store data yet. Configure <code>NUXT_PUBLIC_STORE_SLUG</code> to a real DAM store slug
        and make sure DAM is reachable at <code>NUXT_PUBLIC_DAM_BASE_URL</code>.
      </p>
      <p v-if="error" class="err">DAM fetch error: {{ error.message }}</p>
    </template>
  </main>
</template>

<style scoped>
.shop {
  max-width: 720px;
  margin: 4rem auto;
  padding: 0 1rem;
  font-family: Georgia, 'Times New Roman', serif;
  color: #1a1a1a;
}
header small {
  color: #999;
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
}
h1 {
  font-size: 3rem;
  margin: 1rem 0;
  letter-spacing: -0.02em;
}
.err { color: #b91c1c; }
</style>
