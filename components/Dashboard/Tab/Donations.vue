<template>
  <DashboardTabBase>
    <template #title>
      <Icon name="mdi:hand-heart" />
      {{ $t("dashboard.tabs.donations") }}
    </template>
    <DashboardTableDonations
      v-if="activeAssociationId"
      :association-id="activeAssociationId"
    />
  </DashboardTabBase>
</template>

<script lang="ts" setup>
const dashboardStore = useDashboardStore()
const { activeAssociationId } = storeToRefs(dashboardStore)
</script>

<style>

</style>
