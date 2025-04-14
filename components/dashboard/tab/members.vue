<template>
  <DashboardTabBase title="dashboard.tabs.members">
    <div v-if="status === 'success'" class="overflow-x-auto">
      <div class="flex justify-end items-center">
        <DashboardTabModalExportCsv 
          :csv-url="`/api/association/${activeAssociationId}/members`"
          file-name="members.csv"
        >
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
    </div>
    <div v-else class="flex justify-center items-center flex-1">
      <span class="loading loading-spinner loading-lg" />
    </div>
  </DashboardTabBase>
</template>

<script lang="ts" setup>
const { activeAssociationId } = useDashboardStore()

const { data, status } = await useFetch(() => `/api/association/${activeAssociationId}/members`)

const exportCsv = async () => {
  const blob = await $fetch(`/api/association/${activeAssociationId}/members`, {
    method: "GET",
    headers: {
      "Accept": "text/csv",
    },
    responseType: "blob"
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "members.csv"
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style>

</style>
