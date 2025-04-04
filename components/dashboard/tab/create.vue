<template>
  <DashboardTabBase title="Create Association">
    <p>Create a new association</p>
    <button
      class="btn btn-primary"
      @click="handleCreate"
    >
      Create Association
    </button>
  </DashboardTabBase>
</template>

<script lang="ts" setup>
const dashboard = useDashboardStore()

const handleCreate = async () => {
  const result = await $fetch("/api/association", {
    method: "POST",
    body: {
      name: "New Association",
      description: "This is a new association",
    },
    onResponse: toastifyResponse,
  })

  dashboard.needAssociationListRefresh = true
  dashboard.setTab(DashboardTabType.INFORMATIONS, result.id)
}
</script>

<style>

</style>
