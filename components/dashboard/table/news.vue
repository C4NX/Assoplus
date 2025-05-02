<template>
  <DashboardTabModalEditNews
    :association-id="associationId"
    @on-save="handleModalSave"
  />
  <div class="flex justify-end items-center gap-4 mb-4">
    <DashboardTabModalExportCsv
      :csv-url="`/api/association/${associationId}/news`"
      :file-name="`news-${new Date().toISOString()}.csv`"
    >
      <template #title>
        Exporter en CSV
      </template>
    </DashboardTabModalExportCsv>
    <button
      class="btn btn-primary"
      @click="dashboardNewsStore.openCreate"
    >
      Créer une news
    </button>
  </div>
  <UtilsLoading :status="status">
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th />
            <th>Titre</th>
            <th>Auteur.ice</th>
            <th>Date</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in (data?.items || [])"
            :key="index"
          >
            <th>{{ (page - 1) * (data?.itemPerPage || 10) + index + 1 }}</th>
            <td>{{ item.title }}</td>
            <td>{{ item.author.firstName }} {{ item.author.lastName }}</td>
            <td>{{ $d(new Date(item.createdAt), 'long') }}</td>
            <td>
              <div class="flex gap-4">
                <button
                  class="btn btn-primary btn-sm"
                  @click="() => dashboardNewsStore.openEdit(item)"
                >
                  <Icon name="mdi:pencil" />
                  Modifier
                </button>
                <button
                  class="btn btn-error btn-sm"
                  @click="() => handleDelete(item.id)"
                >
                  <Icon name="mdi:trash-can" />
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="data?.items.length === 0">
            <td
              colspan="5"
              class="text-center"
            >
              Aucune news disponible
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center items-center mt-4">
        <InputPagination
          v-model="page"
          :total-pages="data?.totalPages ?? 0"
          @on-page-change="refresh"
        />
      </div>
    </div>
  </UtilsLoading>
</template>

<script lang="ts" setup>
const dashboardNewsStore = useDashboardNewsStore()

const props = defineProps({
  associationId: {
    type: String,
    required: false,
  },
})

const associationId = computed(() => props.associationId)
const page = ref(1)

const {
  data,
  refresh,
  status,
} = useFetch(() => `/api/association/${associationId.value}/news`, {
  params: {
    page: page,
  },
  watch: [page],
})

const handleModalSave = async () => {
  await refresh()
}

const handleDelete = async (id: number) => {
  const currentAssociationId = associationId.value
  if (currentAssociationId === undefined) {
    return
  }

  await dashboardNewsStore.deleteNews(currentAssociationId, id)

  // Refresh the news list
  if (data.value?.items.length === 1) {
    page.value = Math.max(1, page.value - 1)
  }
  else {
    await refresh()
  }
}
</script>

<style>

</style>
