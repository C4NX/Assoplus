<template>
  <UtilsLoading :status="status">
    <div class="flex flex-col gap-2">
      <!-- Header -->
      <div class="flex flex-row gap-2 items-center">
        <span class="text-gray-500 text-h2xl font-bold">
          News
          <span class="text-gray-500">({{ data?.total }})</span>
        </span>
        <InputSearch
          v-model="searchInput"
          :placeholder="$t('association.news.search')"
          size="sm"
          debounce
        />
      </div>

      <!-- News List -->
      <div
        v-for="news in data?.items"
        :key="news.id"
        class="association-news-container"
      >
        <div class="collapse collapse-plus">
          <input
            ref="newsOpenCheckbox"
            type="checkbox"
            :data-news-id="news.id"
            @change="articleOpenChange"
          >
          <div class="collapse-title text-xl font-medium">
            {{ news.title }}
          </div>
          <div class="collapse-content">
            <article v-html="$sanitizeHTML(news.content)" />
            <p class="text-sm text-gray-400 text-right">
              <span class="text-gray-700 font-semibold">{{ news.createdBy?.firstName }} {{ news.createdBy?.lastName }}</span>
              -
              {{ $d(new Date(news.createdAt)) }}
            </p>
          </div>
        </div>
      </div>
      <InputPagination
        v-if="data?.totalPages"
        v-model="currentPage"
        :total-pages="data.totalPages"
      />
    </div>
    <p
      v-if="data?.items.length === 0"
      class="text-gray-500 text-sm"
    >
      Pas de news disponible pour le moment
    </p>
  </UtilsLoading>
</template>

<script lang="ts" setup>
const currentPage = ref(1)
const searchInput = ref<string | undefined>(undefined)

const newsOpenCheckbox = ref<HTMLInputElement[] | null>(null)
const renderedArticles = reactive<Record<string, boolean>>({})

const articleOpenChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const newsId = target.dataset.newsId
  if (newsId) {
    renderedArticles[newsId] = target.checked
  }
}

const props = defineProps({
  associationId: {
    type: String,
    required: true,
  },
})

const { data, status } = useFetch(`/api/association/${props.associationId}/news/public`, {
  query: {
    page: currentPage,
    search: searchInput
  }
})
</script>

<style scoped>
.association-news-container {
  @apply bg-base-100 rounded-lg border border-base-200 shadow-md;
}
</style>
