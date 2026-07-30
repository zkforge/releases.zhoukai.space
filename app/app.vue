<script setup>
useHead({
  htmlAttrs: {
    lang: 'en',
  },
})
</script>

<template>
  <UApp>
    <NuxtPage />
    <p class="py-6 pb-10 text-sm flex items-center justify-center gap-2 flex-wrap px-4">
      <UButton
        to="https://github.com/zkforge/releases.zhoukai.space"
        rel="noopener"
        target="_blank"
        color="neutral"
        variant="subtle"
        size="sm"
        icon="i-simple-icons-github"
      >
        Source code
      </UButton>
    </p>
    <ScrollToTop />
  </UApp>
</template>
