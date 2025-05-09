<template>
  <div class="min-h-[calc(100vh-60px)] pt-[60px] bg-grid flex flex-col">
    <UtilsLoading :status="userAssociationsStatus">
      <aside
        v-if="userAssociationsStatus === 'success'"
        class="container mx-auto m-0 max-w-full p-0 lg:p-4 lg:max-w-10xl lg:my-10"
      >
        <div class="dashboard-content">
          <!-- Sidebar Navigation -->
          <ul
            v-if="userAssociations"
            class="dashboard-menu"
          >
            <li>
              <a
                :class="{ active: activeTab === DashboardTabType.HOME }"
                @click="() => dashboardStore.setTab(DashboardTabType.HOME)"
              >
                <Icon name="mdi:home" />
                {{ $t("dashboard.tabs.home") }}
              </a>
            </li>
            <!-- Admin Section -->
            <li
              v-if="user?.roles?.includes('ROLE_ADMIN')"
              class="text-error"
            >
              <details>
                <summary>
                  <Icon name="mdi:shield-account" />
                  {{ $t("dashboard.tabs.admin") }}
                </summary>
                <ul class="menu menu-sub">
                  <li class="disabled">
                    <a>
                      <Icon name="mdi:account" />
                      {{ $t("dashboard.tabs.admin-users") }}
                    </a>
                  </li>
                  <li class="disabled">
                    <a>
                      <Icon name="mdi:account-group" />
                      {{ $t("dashboard.tabs.admin-associations") }}
                    </a>
                  </li><li class="disabled">
                    <a>
                      <Icon name="mdi:tag" />
                      {{ $t("dashboard.tabs.admin-tags") }}
                    </a>
                  </li>
                </ul>
              </details>
            </li>
            <!-- Associations List -->
            <li
              v-for="association in userAssociations"
              :key="association.id"
            >
              <details>
                <summary>
                  {{ association.name }}
                </summary>
                <ul class="menu menu-sub">
                  <!-- Information Tab -->
                  <li>
                    <a
                      :class="{ active: activeTab === DashboardTabType.INFORMATIONS && dashboardStore.activeAssociationId === association.id }"
                      @click="dashboardStore.setTab(DashboardTabType.INFORMATIONS, association.id)"
                    >
                      <Icon name="mdi:information" />
                      {{ $t("dashboard.tabs.informations") }}
                    </a>
                  </li>
                  <!-- Volunteer Tab -->
                  <li>
                    <a
                      :class="{ active: activeTab === DashboardTabType.VOLUNTEER && dashboardStore.activeAssociationId === association.id }"
                      @click="dashboardStore.setTab(DashboardTabType.VOLUNTEER, association.id)"
                    >
                      <Icon name="mdi:account-group" />
                      {{ $t("dashboard.tabs.volunteers") }}
                    </a>
                  </li>
                  <!-- Donations Tab -->
                  <li>
                    <a
                      :class="{ active: activeTab === DashboardTabType.DONATIONS && dashboardStore.activeAssociationId === association.id }"
                      @click="dashboardStore.setTab(DashboardTabType.DONATIONS, association.id)"
                    >
                      <Icon name="mdi:hand-heart" />
                      {{ $t("dashboard.tabs.donations") }}
                    </a>
                  </li>
                  <!-- News Tab -->
                  <li>
                    <a
                      :class="{ active: activeTab === DashboardTabType.NEWS && dashboardStore.activeAssociationId === association.id }"
                      @click="dashboardStore.setTab(DashboardTabType.NEWS, association.id)"
                    >
                      <Icon name="mdi:newspaper" />
                      {{ $t("dashboard.tabs.news") }}
                    </a>
                  </li>
                  <!-- Events Tab -->
                  <li class="disabled">
                    <a @click="dashboardStore.setTab(DashboardTabType.EVENTS, association.id)">
                      <Icon name="mdi:calendar" />
                      {{ $t("dashboard.tabs.events") }}
                    </a>
                  </li>
                  <!-- Settings Tab -->
                  <li class="disabled">
                    <a @click="dashboardStore.setTab(DashboardTabType.SETTINGS, association.id)">
                      <Icon name="mdi:cog" />
                      {{ $t("dashboard.tabs.settings") }}
                    </a>
                  </li>
                </ul>
              </details>
            </li>
            <!-- Add Association -->
            <li>
              <a
                :class="{ active: activeTab === DashboardTabType.CREATE }"
                @click="dashboardStore.setTab(DashboardTabType.CREATE)"
              >
                <Icon name="mdi:plus" />
                Créer une association
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
          <article
            v-if="userAssociations"
            class="flex-1 flex"
          >
            <DashboardTabMain v-if="activeTab === DashboardTabType.HOME" />
            <DashboardTabInformations v-if="activeTab === DashboardTabType.INFORMATIONS" />
            <DashboardTabVolunteers v-if="activeTab === DashboardTabType.VOLUNTEER" />
            <DashboardTabCreate v-if="activeTab === DashboardTabType.CREATE" />
            <DashboardTabNews v-if="activeTab === DashboardTabType.NEWS" />
            <DashboardTabDonations v-if="activeTab === DashboardTabType.DONATIONS" />
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

const { user } = useUserSession()

const dashboardStore = useDashboardStore()
const { activeTab } = storeToRefs(dashboardStore)

// Handle list of associations in the dashboard store
watch(userAssociations, (newValue) => {
  if (newValue) {
    dashboardStore.setAssociations(newValue)
  }
}, { immediate: true })

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
