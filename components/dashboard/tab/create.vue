<template>
  <DashboardTabBase>
    <template #title>
      <Icon name="mdi:star-four-points" />
      {{ $t("dashboard.tabs.create") }}
    </template>
    <AssociationEdit @association-created="handleOnAssociationCreated" />
  </DashboardTabBase>
</template>

<script lang="ts" setup>
const dashboard = useDashboardStore()

const handleOnAssociationCreated = (associationId: string) => {
  dashboard.needAssociationListRefresh = true
  dashboard.setTab(DashboardTabType.INFORMATIONS, associationId)
}
</script>

<style>

</style>
