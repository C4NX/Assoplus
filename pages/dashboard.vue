<template>
  <div class="min-h-[calc(100vh-60px)] pt-[60px] bg-grid flex flex-col">
    <UtilsLoading :status="userAssociationsStatus">
      <aside class="container mx-auto m-0 max-w-full p-0 lg:p-4 lg:max-w-10xl lg:my-10"
        v-if="userAssociationsStatus === 'success'">
        <div class="dashboard-content">
          <!-- Sidebar Navigation -->
          <ul v-if="userAssociations" class="dashboard-menu">
            <li>
              <a :class="{ active: activeTab === DashboardTabType.HOME }"
                @click="() => dashboardStore.setTab(DashboardTabType.HOME)">
                <Icon name="mdi:home" />
                {{ $t("dashboard.tabs.home") }}
              </a>
            </li>
            <!-- Associations List -->
            <li v-for="activeAssociation in userAssociations" :key="activeAssociation.id">
              <details open>
                <summary>
                  <Icon name="mdi:home" />
                  {{ activeAssociation.name }}
                </summary>
                <ul class="menu menu-sub">
                  <li>
                    <a :class="{ active: activeTab === DashboardTabType.INFORMATIONS }"
                      @click="dashboardStore.setTab(DashboardTabType.INFORMATIONS, activeAssociation.id)">
                      <Icon name="mdi:information" />
                      {{ $t("dashboard.tabs.informations") }}
                    </a>
                  </li>
                  <li>
                    <a :class="{ active: activeTab === DashboardTabType.VOLUNTEER }"
                      @click="dashboardStore.setTab(DashboardTabType.VOLUNTEER, activeAssociation.id)">
                      <Icon name="mdi:account-group" />
                      {{ $t("dashboard.tabs.volunteers") }}
                    </a>
                  </li>
                  <li>
                    <a :class="{ active: activeTab === DashboardTabType.NEWS }"
                      @click="dashboardStore.setTab(DashboardTabType.NEWS, activeAssociation.id)">
                      <Icon name="mdi:newspaper" />
                      {{ $t("dashboard.tabs.news") }}
                    </a>
                  </li>
                  <li class="disabled">
                    <a @click="dashboardStore.setTab(DashboardTabType.EVENTS, activeAssociation.id)">
                      <Icon name="mdi:calendar" />
                      {{ $t("dashboard.tabs.events") }}
                    </a>
                  </li>
                  <li class="disabled">
                    <a @click="dashboardStore.setTab(DashboardTabType.SETTINGS, activeAssociation.id)">
                      <Icon name="mdi:cog" />
                      {{ $t("dashboard.tabs.settings") }}
                    </a>
                  </li>
                </ul>
              </details>
            </li>
            <!-- Add Association -->
            <li>
              <a :class="{ active: activeTab === DashboardTabType.CREATE }"
                @click="dashboardStore.setTab(DashboardTabType.CREATE)">
                <Icon name="mdi:plus" />
                Créer une association
              </a>
            </li>
          </ul>
          <div v-else class="flex flex-col gap-2 p-4">
            <div class="skeleton h-4 w-full" />
            <div class="skeleton h-4 w-full" />
            <div class="skeleton h-4 w-full" />
          </div>
          <!-- Main Content -->
          <article v-if="userAssociations" class="flex-1 flex">
            <DashboardTabMain v-if="activeTab === DashboardTabType.HOME" />
            <DashboardTabInformations v-if="activeTab === DashboardTabType.INFORMATIONS" />
            <DashboardTabVolunteers v-if="activeTab === DashboardTabType.VOLUNTEER" />
            <DashboardTabCreate v-if="activeTab === DashboardTabType.CREATE" />
            <DashboardTabNews v-if="activeTab === DashboardTabType.NEWS" />
          </article>
        </div>
      </aside>
    </UtilsLoading>
  </div>
</template>

<script lang="ts" setup>
const { data: userAssociations, refresh: refreshUserAssociations, status: userAssociationsStatus } = await useFetch("/api/me/associations")

definePageMeta({
  title: "Dashboard",
  middleware: ["authenticated"],
})

const dashboardStore = useDashboardStore()
const { activeTab } = storeToRefs(dashboardStore)

// Handle refeshing of the user associations list with the dashboard store
watch(() => dashboardStore.needAssociationListRefresh, async (newValue, oldValue) => {
  if (newValue !== oldValue && newValue) {
    await refreshUserAssociations()
    dashboardStore.needAssociationListRefresh = false
  }
}, { immediate: true })
</script>

<style lang="postcss" scoped>

.dashboard-menu {
  @apply menu menu-md bg-base-100 rounded-lg border border-base-200 shadow-md;
}

.dashboard-content {
  @apply flex gap-6 flex-col-reverse lg:flex-row flex-nowrap;
}

</style>
