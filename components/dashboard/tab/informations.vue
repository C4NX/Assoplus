<template>
  <DashboardTabBase>
    <template #title>
      <Icon name="mdi:information-outline" />
      Informations
    </template>
    <button
      class="btn btn-error"
      @click="handleDelete"
    >
      Delete Association
    </button>
  </DashboardTabBase>
</template>

<script lang="ts" setup>
const dashboard = useDashboardStore()

const handleDelete = async () => {
  await $fetch(`/api/association/${dashboard.activeAssociationId}`, {
    method: "DELETE",
    onResponse: toastifyResponse,
  })

  dashboard.needAssociationListRefresh = true
  dashboard.setTab(DashboardTabType.HOME, null)
}
</script>

<style></style>
