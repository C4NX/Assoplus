<template>
  <div
    v-if="totalPages >= 1"
    class="pagination-container"
  >
    <div class="join">
      <button
        class="join-item btn-pagination"
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
          v-if="page === -1"
          class="join-item btn-pagination pointer-events-none"
        >
          ...
        </button>
        <button
          v-else
          class="join-item btn-pagination"
          :class="{ 'btn-primary !bg-primary': page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </template>

      <button
        class="join-item btn-pagination"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        »
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  totalPages: number
  modelValue: number
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void
}>()

const currentPage = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value),
})

const displayedPages = computed(() => {
  if (props.totalPages <= 5) {
    return Array.from({ length: props.totalPages }, (_, i) => i + 1)
  }

  const pages: (number | -1)[] = []
  const currentPageValue = props.modelValue

  if (currentPageValue <= 3) {
    pages.push(1, 2, 3, -1, props.totalPages)
  }
  else if (currentPageValue >= props.totalPages - 2) {
    pages.push(1, -1, props.totalPages - 2, props.totalPages - 1, props.totalPages)
  }
  else {
    pages.push(
      1,
      -1,
      currentPageValue - 1,
      currentPageValue,
      currentPageValue + 1,
      -1,
      props.totalPages,
    )
  }

  return pages
})

const goToPage = (page: number) => {
  if (page < 1 || page > props.totalPages || page === props.modelValue) return
  currentPage.value = page
}
</script>

<style scoped lang="postcss">
.pagination-container {
  @apply flex justify-center mt-6;
}

.btn-pagination {
  @apply bg-base-100 btn rounded-full;
}
</style>
