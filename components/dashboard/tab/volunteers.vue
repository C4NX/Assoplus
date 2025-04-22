<template>
  <DashboardTabBase>
    <template #title>
      <Icon name="mdi:account-group" />
      {{ $t("dashboard.tabs.volunteers") }}
    </template>
    <div v-if="status === 'success'" class="overflow-x-auto">
      <div class="flex justify-between items-center gap-4">
        <label class="input input-bordered input-md flex-1 flex items-center gap-2">
          <Icon name="mdi:magnify" class="w-5 h-5" />
          <input type=" text" class="grow" placeholder="Rechercher un membre" v-model="searchInput" />
        </label>
        <DashboardTabModalExportCsv :csv-url="`/api/association/${activeAssociationId}/volunteers`"
          file-name="members.csv">
          <template #title>
            {{ $t("dashboard.tabs.members.export_csv") }}
          </template>
        </DashboardTabModalExportCsv>
      </div>
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" class="checkbox">
              </label>
            </th>
            <th>Membre</th>
            <th>Rôles</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in data?.items" :key="member.id">
            <th>
              <label>
                <input type="checkbox" class="checkbox">
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
      <InputPagination v-if="data?.totalPages" :total-pages="data?.totalPages" v-model="currentPage" />
    </div>
    <div v-else class="flex justify-center items-center flex-1">
      <span class="loading loading-spinner loading-lg" />
    </div>
  </DashboardTabBase>
</template>

<script lang="ts" setup>
const { activeAssociationId } = useDashboardStore()

const currentPage = ref(1)
const searchInput = ref("")
const searchParams = computed(() => {
  return searchInput.value !== "" ? searchInput.value : undefined
})

const { data, status } = await useFetch(() => `/api/association/${activeAssociationId}/volunteers`, {
  params: {
    page: currentPage,
    search: searchParams,
  },
  watch: [currentPage, searchParams],
})
</script>

<style>

</style>
