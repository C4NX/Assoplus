<template>
  <div class="min-h-[calc(100vh-60px)] pt-[60px] bg-grid">
    <div class="container mx-auto max-w-10xl my-10 p-4">
      <div class="flex gap-6">
        <!-- Sidebar Navigation -->
        <ul class="menu menu-md bg-base-200 rounded-lg w-full max-w-xs" v-if="userAssociations">
          <li>
            <a @click="dashboardStore.setTab(DashboardTabType.HOME, null)">
              <Icon name="mdi:home" />
              Dashboard
            </a>
          </li>
          <li v-for="activeAssociation in userAssociations" :key="activeAssociation.id"
            :class="{'disabled': userAssociationsStatus === 'pending'}">
            <details open>
              <summary>
                <Icon name="mdi:home" />
                {{ activeAssociation.name }}
              </summary>
              <ul class="menu menu-sub">
                <li>
                  <a @click="dashboardStore.setTab(DashboardTabType.INFORMATIONS, activeAssociation.id)">
                    <Icon name="mdi:information" />
                    Informations
                  </a>
                </li>
                <li>
                  <a @click="dashboardStore.setTab(DashboardTabType.MEMBERS, activeAssociation.id)">
                    <Icon name="mdi:account-group" />
                    Members
                  </a>
                </li>
                <li>
                  <a @click="dashboardStore.setTab(DashboardTabType.NEWS, activeAssociation.id)">
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
          <li>
            <a @click="dashboardStore.setTab(DashboardTabType.CREATE, null)">
              <Icon name="mdi:plus" />
              Create Association
            </a>
          </li>
        </ul>
        <div class="flex flex-col gap-2 p-4" v-else>
          <div class="skeleton h-4 w-full"></div>
          <div class="skeleton h-4 w-full"></div>
          <div class="skeleton h-4 w-full"></div>
        </div>
        <!-- Main Content -->
        <DashboardTabMain v-if="dashboardStore.activeTab === DashboardTabType.HOME" />
        <DashboardTabInformations
          v-if="userAssociations && dashboardStore.activeTab === DashboardTabType.INFORMATIONS" />
        <DashboardTabMembers v-if="userAssociations && dashboardStore.activeTab === DashboardTabType.MEMBERS" />
        <DashboardTabCreate v-if="userAssociations && dashboardStore.activeTab === DashboardTabType.CREATE" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { data: userAssociations, refresh: refreshUserAssociations, status: userAssociationsStatus } = useFetch('/api/me/associations')

definePageMeta({
  title: 'Dashboard',
  middleware: ['authenticated'],
})

const dashboardStore = useDashboardStore()

watch(() => dashboardStore.needAssociationListRefresh, async (newValue, oldValue) => {
  if (newValue !== oldValue && newValue) {
    await refreshUserAssociations()
    dashboardStore.needAssociationListRefresh = false
  }
}, { immediate: true })

</script>

<style></style>
