<template>
  <div class="min-h-screen pt-20 bg-grid flex flex-col">
    <div class="flex-1 p-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-3xl font-bold">
          {{ $t("association.list.title") }}
        </h2>
      </div>

      <div class="flex items-center gap-2 mb-4">
        <!-- Search Bar -->
        <InputSearch
          v-model="searchInput"
          :placeholder="$t('association.list.search')"
          debounce
        />
        <!-- Sort Order -->
        <InputButtonSort v-model="searchOrder" />
        <!-- Add Association Button -->
        <button
          class="btn btn-primary"
          @click="goToDashboard(DashboardTabType.CREATE)"
        >
          <Icon
            name="mdi:plus"
            class="w-5 h-5"
          />
        </button>
      </div>

      <!-- Associations List -->
      <UtilsLoading :status="status">
        <div class="space-y-4">
          <div
            v-for="association in data?.items"
            :key="association.id"
            class="association-card"
          >
            <div class="association-card-content">
              <div
                v-if="association.logoPathUrl"
                class="avatar-container"
              >
                <img
                  :src="association.logoPathUrl"
                  class="association-logo"
                >
              </div>
              <div class="flex-1">
                <h3 class="association-name">
                  {{ association.name }}
                </h3>
                <p class="association-description">
                  {{ association.description }}
                </p>
                <div class="tags-container">
                  <AssociationTag
                    v-for="tag in association.tags"
                    :key="tag.id"
                    :type="tag.type"
                  >
                    {{ tag.name }}
                  </AssociationTag>
                </div>
              </div>
              <div class="association-card-buttons">
                <NuxtLinkLocale
                  :to="`/associations/${association.id}`"
                  class="btn btn-primary"
                >
                  <Icon
                    name="mdi:eye"
                    class="w-5 h-5"
                  />
                  {{ $t("association.list.view") }}
                </NuxtLinkLocale>
              </div>
            </div>
          </div>
          <div
            v-if="data?.items.length === 0"
            class="text-center"
          >
            <p class="text-lg text-base-content/70">
              {{ $t("association.list.empty") }}
            </p>
          </div>
        </div>

        <!-- Pagination -->
        <InputPagination
          v-if="data?.totalPages"
          v-model="currentPage"
          :total-pages="data.totalPages"
        />
      </UtilsLoading>
    </div>
  </div>
</template>

<script lang="ts" setup>
const searchOrder = ref<"asc" | "desc">("asc")
const searchInput = ref<string | undefined>(undefined)
const currentPage = ref(1)
const localPath = useLocalePath()

const { data, status } = useFetch("/api/association", {
  params: {
    page: currentPage,
    search: searchInput,
    order: searchOrder,
  },
  watch: [currentPage],
})

const goToDashboard = async (tab: DashboardTabType, associationId: string | undefined = undefined) => {
  const dashboardStore = useDashboardStore()
  dashboardStore.setTab(tab, associationId)

  await navigateTo(localPath("/dashboard"))
}
</script>

<style scopped lang="postcss">
.association-card {
  @apply p-6 transition-shadow hover:shadow-xl bg-base-100 border border-base-200 rounded-lg;
}

.association-card-buttons {
  @apply flex items-end self-end md:items-start md:self-auto;
}

.association-card-content {
  @apply flex gap-6 items-start md:items-center flex-col md:flex-row;
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
  @apply bg-base-100 btn rounded-full;
}
</style>
