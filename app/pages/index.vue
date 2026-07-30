<script setup lang="ts">
const colorMode = useColorMode()
const config = useRuntimeConfig()
const { data: contributions, error, status } = await useFetch<Contributions>('/api/contributions')

const user = computed(() => contributions.value?.user ?? {
  name: config.public.githubName,
  username: config.public.githubUsername,
  avatar: `https://github.com/${config.public.githubUsername}.png`,
})
const prs = computed(() => contributions.value?.prs ?? [])
const userUrl = computed(() => `https://github.com/${user.value.username}`)

useHead({
  link: [
    { rel: 'icon', href: '/favicon.png' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'alternate', type: 'application/rss+xml', title: `${config.public.githubName}'s merged pull requests`, href: '/feed.xml' },
  ],
})
const url = useRequestURL()
useSeoMeta({
  title: `${config.public.githubName} is Contributing`,
  description: `Discover ${config.public.githubName}'s merged pull requests on GitHub.`,
  ogTitle: `${config.public.githubName} is Contributing`,
  ogDescription: `Discover ${config.public.githubName}'s merged pull requests on GitHub.`,
  twitterCard: 'summary_large_image',
  ogImage: `${url.origin}/og.png`,
  twitterImage: `${url.origin}/og.png`,
})

const order = ref<'asc' | 'desc'>('desc')
const orderKey = ref<'date' | 'star'>('date')

const items = computed(() => [
  [{
    label: 'Star',
    icon: 'i-lucide-star',
    checked: orderKey.value === 'star',
    type: 'checkbox' as const,
    onUpdateChecked(checked: boolean) {
      orderKey.value = checked ? 'star' : 'date'
    },
    onSelect(e: Event) {
      e.preventDefault()
    },
  }],
  [{
    label: orderKey.value === 'date' ? 'Oldest' : 'Ascending',
    icon: 'i-lucide-arrow-up-narrow-wide',
    checked: order.value === 'asc',
    type: 'checkbox' as const,
    onUpdateChecked(checked: boolean) {
      if (!checked) return
      order.value = 'asc'
    },
    onSelect(e: Event) {
      e.preventDefault()
    },
  }, {
    label: orderKey.value === 'date' ? 'Newest' : 'Descending',
    icon: 'i-lucide-arrow-down-narrow-wide',
    checked: order.value === 'desc',
    type: 'checkbox' as const,
    onUpdateChecked(checked: boolean) {
      if (!checked) return
      order.value = 'desc'
    },
    onSelect(e: Event) {
      e.preventDefault()
    },
  }],
])

const orderedPrs = computed(() => {
  const sortedPrs = [...prs.value]
  sortedPrs.sort((a, b) => {
    if (orderKey.value === 'star') {
      return order.value === 'asc' ? a.stars - b.stars : b.stars - a.stars
    }
    else {
      const dateA = new Date(a.merged_at).getTime()
      const dateB = new Date(b.merged_at).getTime()
      return order.value === 'asc' ? dateA - dateB : dateB - dateA
    }
  })
  return sortedPrs
})
</script>

<template>
  <UContainer class="p-4 sm:p-6 lg:p-8 lg:pt-10 max-w-3xl">
    <div class="flex flex-col items-center gap-2">
      <a :href="userUrl" target="_blank"><UAvatar
        :src="user.avatar"
        :alt="user.name"
        size="xl"
      />
      </a>
      <h1 class="text-2xl sm:text-3xl text-center">
        <a :href="userUrl" target="_blank">
          {{ user.name }}
        </a>
        is <span class="animate-pulse">Contributing...</span>
      </h1>
      <p class="w-full px-2 text-center text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300">
        <NuxtLink :to="userUrl" target="_blank" class="block truncate">
          @{{ user.username }}'s merged pull requests on GitHub.
        </NuxtLink>
      </p>
      <div class="flex items-center justify-center gap-1 text-neutral-700 dark:text-neutral-300">
        <ClientOnly>
          <UButton
            :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            :icon="colorMode.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
            color="neutral"
            variant="link"
            @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
          />
          <template #fallback>
            <div class="w-8 h-8" />
          </template>
        </ClientOnly>
        <UButton
          :to="userUrl"
          external
          target="_blank"
          :aria-label="`${user.name}'s GitHub profile`"
          icon="i-lucide-github"
          color="neutral"
          variant="link"
        />
        <UButton
          to="/feed.xml"
          external
          target="_blank"
          aria-label="RSS Feed"
          icon="i-lucide-rss"
          color="neutral"
          variant="link"
        />
      </div>
      <USeparator class="mt-2 sm:mt-6 mb-6 sm:mb-10 w-1/2 mx-auto animate-pulse" />
    </div>

    <div class="relative">
      <div class="flex justify-end absolute -top-10 lg:-top-12 right-0">
        <UDropdownMenu
          v-if="orderedPrs.length"
          :items="items"
          :content="{
            align: 'start',
            side: 'bottom',
            sideOffset: 8,
          }"
          :ui="{
            content: 'w-48',
          }"
          size="xs"
        >
          <UButton
            :label="orderKey === 'star' ? 'Stars' : order === 'asc' ? 'Oldest' : 'Newest'"
            :icon="order === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-narrow-wide'"
            color="neutral"
            variant="soft"
            size="xs"
          />
        </UDropdownMenu>
      </div>
      <div class="flex flex-col gap-6 mt-5 sm:gap-10">
        <p v-if="status === 'pending'" class="py-12 text-center text-neutral-500 dark:text-neutral-400">
          Loading merged pull requests…
        </p>
        <div v-else-if="error" class="py-12 text-center">
          <p class="font-medium text-neutral-900 dark:text-white">
            GitHub activity could not be loaded.
          </p>
          <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Visit <a :href="userUrl" target="_blank" class="underline">@{{ user.username }}</a> on GitHub instead.
          </p>
        </div>
        <div v-else-if="!orderedPrs.length" class="py-12 text-center">
          <p class="font-medium text-neutral-900 dark:text-white">
            No public merged pull requests yet.
          </p>
          <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            New contributions will appear here after they are merged.
          </p>
        </div>
        <template v-else>
          <PullRequest v-for="pr of orderedPrs" :key="pr.url" :data="pr" />
        </template>
      </div>
    </div>
  </UContainer>
</template>
