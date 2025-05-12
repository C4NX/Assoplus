<template>
  <DashboardTabBase>
    <template #title>
      <Icon name="mdi:newspaper" />
      {{ $t("dashboard.tabs.news") }}
    </template>
    <DashboardTableNews :association-id="activeAssociationId" />
  </DashboardTabBase>
</template>

<script lang="ts" setup>
const dashboardStore = useDashboardStore()
const { activeAssociationId } = storeToRefs(dashboardStore)
</script>
