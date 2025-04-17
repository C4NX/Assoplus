<template>
  <div class="min-h-[calc(100vh-60px)] pt-[60px] bg-grid">
    <div class="container mx-auto max-w-10xl my-10 p-4">
      <div class="flex gap-6">
        <!-- Sidebar Navigation -->
        <ul
          v-if="userAssociations"
          class="menu menu-md bg-base-200 rounded-lg w-full max-w-xs"
        >
          <li>
            <a @click="dashboardStore.setTab(DashboardTabType.HOME, null)" :class="{ active: activeTab === DashboardTabType.HOME }">
              <Icon name="mdi:home" />
              Dashboard
            </a>
          </li>
          <li
            v-for="activeAssociation in userAssociations"
            :key="activeAssociation.id"
            :class="{ disabled: userAssociationsStatus === 'pending' }"
          >
            <details open>
              <summary>
                <Icon name="mdi:home" />
                {{ activeAssociation.name }}
              </summary>
              <ul class="menu menu-sub">
                <li>
                  <a @click="dashboardStore.setTab(DashboardTabType.INFORMATIONS, activeAssociation.id)" :class="{ active: activeTab === DashboardTabType.INFORMATIONS }">
                    <Icon name="mdi:information" />
                    Informations
                  </a>
                </li>
                <li>
                  <a @click="dashboardStore.setTab(DashboardTabType.MEMBERS, activeAssociation.id)" :class="{ active: activeTab === DashboardTabType.MEMBERS }">
                    <Icon name="mdi:account-group" />
                    Members
                  </a>
                </li>
                <li >
                  <a @click="dashboardStore.setTab(DashboardTabType.NEWS, activeAssociation.id)" :class="{ active: activeTab === DashboardTabType.NEWS }">
                    <Icon name="mdi:newspaper" />
                    News
                  </a>
                </li>
                <li class="disabled">
                  <a @click="dashboardStore.setTab(DashboardTabType.EVENTS, activeAssociation.id)">
                    <Icon name="mdi:calendar" />
                    Events
                  </a>
                </li>
                <li class="disabled">
                  <a @click="dashboardStore.setTab(DashboardTabType.SETTINGS, activeAssociation.id)">
                    <Icon name="mdi:cog" />
                    Settings
                  </a>
                </li>
              </ul>
            </details>
          </li>
          <li >
            <a @click="dashboardStore.setTab(DashboardTabType.CREATE, null)" :class="{ active: activeTab === DashboardTabType.CREATE }">
              <Icon name="mdi:plus" />
              Create Association
            </a>
          </li>
        </ul>
        <div
          v-else
          class="flex flex-col gap-2 p-4"
        >
          <div class="skeleton h-4 w-full" />
          <div class="skeleton h-4 w-full" />
          <div class="skeleton h-4 w-full" />
        </div>
        <!-- Main Content -->
        <DashboardTabMain v-if="activeTab === DashboardTabType.HOME" />
        <DashboardTabInformations
          v-if="userAssociations && activeTab === DashboardTabType.INFORMATIONS"
        />
        <DashboardTabMembers v-if="userAssociations && activeTab === DashboardTabType.MEMBERS" />
        <DashboardTabCreate v-if="userAssociations && activeTab === DashboardTabType.CREATE" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { data: userAssociations, refresh: refreshUserAssociations, status: userAssociationsStatus } = useFetch("/api/me/associations")

definePageMeta({
  title: "Dashboard",
  middleware: ["authenticated"],
})

const dashboardStore = useDashboardStore()
const { activeTab } = storeToRefs(dashboardStore)

watch(() => dashboardStore.needAssociationListRefresh, async (newValue, oldValue) => {
  if (newValue !== oldValue && newValue) {
    await refreshUserAssociations()
    dashboardStore.needAssociationListRefresh = false
  }
}, { immediate: true })
</script>

<style></style>
