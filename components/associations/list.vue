<template>
  <div class="flex-1 p-4">
    <!-- Search Bar -->
    <div class="p-4 bg-base-300 m-2 rounded-box">
      <input
        v-model="searchTerm"
        type="text"
        class="input input-bordered w-full"
        placeholder="Search associations"
        @input="handleSearch"
      >
    </div>

    <!-- Associations List -->
    <div
      v-if="isLoading"
      class="flex-1 p-4"
    >
      <div class="flex justify-center">
        <span class="loading loading-spinner text-primary" />
      </div>
    </div>

    <div
      v-else
      class="flex-1"
    >
      <div
        v-for="association in data"
        :key="association.id"
        class="p-4 bg-base-300 m-2 rounded-box"
      >
        <h1 class="text-2xl font-bold">
          {{ association.name }}
        </h1>
        <p>{{ association.description }}</p>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-center">
      <div class="join p-4 bg-base-300 m-2 rounded-box">
        <button
          class="join-item btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          «
        </button>

        <template
          v-for="page in displayedPages"
          :key="page"
        >
          <button
            class="join-item btn"
            :class="{ 'btn-active': page === currentPage }"
            @click="goToPage(currentPage)"
          >
            {{ page }}
          </button>
        </template>

        <button
          class="join-item btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          »
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"
import type { Association } from "@prisma/client"
import { useAppFetch } from "~/composables/appFetch"

const searchTerm = ref("")
const currentPage = ref(1)
const totalPages = ref(0)
const data = ref<Association[]>()
const isLoading = ref(false)
const appFetch = useAppFetch()

let searchTimeout: ReturnType<typeof setTimeout>
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchData()
  }, 300)
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const response = await appFetch("/api/association", {
      query: {
        page: currentPage.value,
        search: searchTerm.value,
      },
    })
    data.value = response.items
    totalPages.value = response.totalPages
  }
  finally {
    isLoading.value = false
  }
}

const displayedPages = computed(() => {
  if (!totalPages.value) return []

  const pages = []
  const currentPageValue = currentPage.value

  if (totalPages.value <= 5) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  }
  else {
    if (currentPageValue <= 3) {
      pages.push(1, 2, 3, "...", totalPages)
    }
    else if (currentPageValue >= totalPages.value - 2) {
      pages.push(1, "...", totalPages.value - 2, totalPages.value - 1, totalPages)
    }
    else {
      pages.push(1, "...", currentPageValue - 1, currentPageValue, currentPageValue + 1, "...", totalPages)
    }
  }

  return pages.filter(p => p !== "..." || (typeof p === "number"))
})

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style>
.btn-active {
  @apply bg-primary text-primary-content;
}
</style>
