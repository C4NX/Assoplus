<template>
  <DashboardModalNewsForm
    :association-id="associationId"
    @on-save="handleModalSave"
  />
  <div class="flex justify-end items-center gap-4 mb-4">
    <button
      v-if="hasRights"
      class="btn btn-primary"
      @click="dashboardNewsStore.openCreate"
    >
      <Icon
        name="mdi:plus"
        class="w-5 h-5"
      />
      Ajouter une news
    </button>
    <DashboardModalExportCsv
      :csv-url="`/api/association/${associationId}/news`"
      :file-name="`news-${new Date().toISOString()}.csv`"
    >
      <template #title>
        Exporter en CSV
      </template>
    </DashboardModalExportCsv>
  </div>
  <UtilsLoading :status="status">
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th />
            <th>Titre</th>
            <th>Date de création / auteur.ice</th>
            <th>Date de dernière modification</th>
            <th>Status de publication</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in (data?.items || [])"
            :key="index"
          >
            <th>{{ (page - 1) * (data?.itemPerPage || 10) + index + 1 }}</th>
            <td>{{ item.title }}</td>
            <td>
              {{ $d(new Date(item.createdAt), 'long') }} - {{ item.createdBy.firstName }} {{ item.createdBy.lastName
              }}
            </td>
            <td>
              {{ $d(new Date(item.updatedAt), 'long') }} - {{ item.updatedBy?.firstName }} {{ item.updatedBy?.lastName
              }}
            </td>
            <td>
              <span
                v-if="item.status === 'DRAFT'"
                class="badge badge-success badge-outline"
              >Brouillon</span>
              <span
                v-else-if="item.status === 'PUBLISHED'"
                class="badge badge-primary badge-outline"
              >Publié</span>
              <span
                v-else-if="item.status === 'ARCHIVED'"
                class="badge badge-error badge-outline"
              >Archivé</span>
            </td>
            <td>
              <div class="flex gap-4 flex-col md:flex-row">
                <button
                  v-if="item.status == 'ARCHIVED' && hasRights"
                  class="btn btn-warning btn-sm"
                  @click="handleUnarchive(item)"
                >
                  <Icon name="mdi:pencil" />
                  Désarchiver
                </button>
                <button
                  v-if="item.status != 'ARCHIVED' && hasRights"
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
const dashboardStore = useDashboardStore()

const props = defineProps({
  associationId: {
    type: String,
    required: false,
  },
})

const associationId = computed(() => props.associationId)
const page = ref(1)

const hasRights = computed(() => {
  return dashboardStore.hasRoleOnAssociation(associationId.value, "WRITER")
})

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
  await dashboardNewsStore.deleteNews(id)

  // Refresh the news list
  if (data.value?.items.length === 1) {
    page.value = Math.max(1, page.value - 1)
  }
  await refresh()
}

const handleUnarchive = async (news: NewsData) => {
  dashboardNewsStore.updateNews({ id: news.id, status: "DRAFT" })
  await refresh()
}
</script>

<style>

</style>
