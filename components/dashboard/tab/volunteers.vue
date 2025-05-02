<template>
  <DashboardTabBase>
    <template #title>
      <Icon name="mdi:account-group" />
      {{ $t("dashboard.tabs.volunteers") }}
    </template>
    <UtilsLoading :status="status">
      <div class="flex justify-between items-center gap-4">
        <label class="input input-bordered input-md flex-1 flex items-center gap-2">
          <Icon
            name="mdi:magnify"
            class="w-5 h-5"
          />
          <input
            v-model="searchInput"
            type=" text"
            class="grow"
            placeholder="Rechercher un membre"
          >
        </label>
        <DashboardTabModalExportCsv
          :csv-url="`/api/association/${activeAssociationId}/volunteers`"
          file-name="members.csv"
        >
          <template #title>
            Exporter en CSV
          </template>
        </DashboardTabModalExportCsv>
      </div>
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>
              <label>
                <input
                  type="checkbox"
                  class="checkbox"
                >
              </label>
            </th>
            <th>Membre</th>
            <th>Rôles</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="member in data?.items"
            :key="member.id"
          >
            <th>
              <label>
                <input
                  type="checkbox"
                  class="checkbox"
                >
              </label>
            </th>
            <td>
              <div class="flex items-center gap-3">
                <div>
                  <div class="font-bold">
                    {{ member.firstName }} {{ member.lastName }}
                  </div>
                  <div class="text-sm opacity-50">
                    {{ member.email }}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <InputPagination
        v-if="data?.totalPages"
        v-model="currentPage"
        :total-pages="data?.totalPages"
      />
    </UtilsLoading>
  </DashboardTabBase>
</template>

<script lang="ts" setup>
const { activeAssociationId } = useDashboardStore()

const currentPage = ref(1)
const searchInput = ref("")
const searchParams = computed(() => {
  return searchInput.value !== "" ? searchInput.value : undefined
})

const { data, status } = useFetch(() => `/api/association/${activeAssociationId}/volunteers`, {
  params: {
    page: currentPage,
    search: searchParams,
  },
  watch: [currentPage, searchParams],
})
</script>

<style>

</style>
