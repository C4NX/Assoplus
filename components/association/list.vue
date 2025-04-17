<template>
  <div class="flex-1 p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-3xl font-bold">{{ $t("association.list.title") }}</h2>
    </div>

    <div class="flex items-center gap-2 mb-4">
      <!-- Search Bar -->
      <label class="input input-bordered flex items-center gap-2 flex-1">
        <Icon name="mdi:magnify" class="w-5 h-5" />
        <input type="text" class="grow" :placeholder="$t('association.list.search')" @input="handleSearch($event)" />
      </label>
      <!-- Refresh Button -->
      <label class="swap swap-rotate btn">
        <input type="checkbox" v-model="searchOrderAsc" />
        <Icon name="mdi-sort-alphabetical-ascending" class="swap-on fill-current w-5 h-5" />
        <Icon name="mdi-sort-alphabetical-descending" class="swap-off fill-current w-5 h-5" />
      </label>
      <!-- Add Association Button -->
      <button class="btn btn-primary" @click="goToDashboard(DashboardTabType.CREATE, null)">
        <Icon name="mdi:plus" class="w-5 h-5" />
      </button>
    </div>

    <!-- Associations List -->
    <div v-if="status === 'pending'" class="flex-1 p-4">
      <span class="loading loading-spinner mx-auto block" />
    </div>

    <div v-else class="space-y-4">
      <div v-for="association in data?.items" :key="association.id" class="association-card">
        <div class="flex gap-6 items-center">
          <div v-if="association.logoUuid" class="avatar-container">
            <img :src="`/api/association/${association.id}/logo/${association.logoUuid}`" class="association-logo">
          </div>
          <div class="flex-1">
            <h3 class="association-name">{{ association.name }}</h3>
            <p class="association-description">{{ association.description }}</p>
            <div class="tags-container">
              <span v-for="tag in association.tags" :key="tag.id" class="association-tag">
                {{ tag.name }}
              </span>
            </div>
          </div>
          <div class="flex items-end self-end">
            <NuxtLink :to="`/associations/${association.id}`" class="btn btn-primary">
              <Icon name="mdi:eye" class="w-5 h-5" />
              {{ $t("association.list.view") }}
            </NuxtLink>
          </div>
        </div>
      </div>
      <div v-if="data?.items.length === 0" class="text-center">
        <p class="text-lg text-base-content/70">
          {{ $t("association.list.empty") }}
        </p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-container" v-if="(data?.totalPages ?? 0) >= 1">
      <div class="join">
        <button class="join-item btn-pagination" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
          «
        </button>

        <template v-for="page in displayedPages" :key="page">
          <button v-if="page === -1" class="join-item btn-pagination pointer-events-none">
            ...
          </button>
          <button v-else class="join-item btn-pagination" :class="{ 'btn-primary !bg-primary': page === currentPage }"
            @click="goToPage(page)">
            {{ page }}
          </button>
        </template>
        <button class="join-item btn-pagination" :disabled="currentPage === data?.totalPages"
          @click="goToPage(currentPage + 1)">
          »
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onUnmounted } from "vue"

const searchOrderAsc = ref(true)
const searchOrder = computed(() => (searchOrderAsc.value ? "asc" : "desc"))

const searchTerm = ref("")
const currentPage = ref(1)

const localPath = useLocalePath()

const { data, status, refresh } = await useFetch("/api/association", {
  params: {
    page: currentPage,
    search: searchTerm,
    order: searchOrder,
  },
  watch: false,
})

// Handle search input

let searchTimeout: ReturnType<typeof setTimeout>

const handleSearch = (e: Event) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    currentPage.value = 1
    searchTerm.value = (e.target as HTMLInputElement).value
    await refresh()
  }, 300)
}

onUnmounted(() => {
  clearTimeout(searchTimeout)
})


// Handle search order

watch(() => searchOrderAsc.value, async () => {
  await refresh()
})

// Handle pagination

const displayedPages = computed(() => {
  const totalPages = data?.value?.totalPages
  if (!totalPages) return []

  const pages: number[] = []
  const currentPageValue = currentPage.value

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    if (currentPageValue <= 3) {
      pages.push(1, 2, 3, -1, totalPages)
    } else if (currentPageValue >= totalPages - 2) {
      pages.push(1, -1, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, -1, currentPageValue - 1, currentPageValue, currentPageValue + 1, -1, totalPages)
    }
  }

  return pages
})

const goToPage = (page: number) => {
  const totalPages = data?.value?.totalPages
  if (totalPages === undefined || page < 1 || page > totalPages) return
  currentPage.value = page
  refresh()
}

const goToDashboard = async (tab: DashboardTabType, associationId: number | null) => {
  const dashboardStore = useDashboardStore()
  dashboardStore.setTab(tab, associationId)

  await navigateTo(localPath('/dashboard'))
}
</script>

<style scopped lang="postcss">
.association-card {
  @apply p-6 transition-shadow hover:shadow-xl bg-base-100 border border-base-200 rounded-lg;
}

.avatar-container {
  @apply w-28 h-28 rounded-2xl overflow-hidden shrink-0;
}

.association-logo {
  @apply object-cover w-full h-full transition-transform hover:scale-105;
}

.association-name {
  @apply text-2xl font-semibold mb-2 text-primary;
}

.association-description {
  @apply text-base-content/70 mb-4 line-clamp-2;
}

.tags-container {
  @apply flex flex-wrap gap-2 mt-4;
}

.association-tag {
  @apply badge badge-outline badge-primary px-3 py-2;
}

.pagination-container {
  @apply flex justify-center mt-6;
}

.btn-pagination {
  @apply bg-base-100 btn rounded-full ;
}
</style>