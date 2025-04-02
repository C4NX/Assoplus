<template>
  <div class="min-h-[calc(100vh-60px)] pt-[60px] bg-grid">
    <div class="container mx-auto max-w-10xl my-10 p-4">
      <div class="flex gap-6">
        <!-- Sidebar Navigation -->
        <ul class="menu menu-md bg-base-200 rounded-lg w-full max-w-xs" v-if="data">
          <li>
            <a @click="activeTab = TabType.DASHBOARD">
              <Icon name="mdi:home" />
              Dashboard
            </a>
          </li>
          <li v-for="association in data" :key="association.id">
            <details open>
              <summary>
                <Icon name="mdi:home" />
                {{ association.name }}
              </summary>
              <ul class="menu menu-sub">
                <li>
                  <a @click="openTab(TabType.MEMBERS, association)">
                    <Icon name="mdi:account-group" />
                    Members
                  </a>
                </li>
                <li>
                  <a @click="openTab(TabType.NEWS, association)">
                    <Icon name="mdi:newspaper" />
                    News
                  </a>
                </li>
                <li class="disabled">
                  <a @click="openTab(TabType.EVENTS, association)">
                    <Icon name="mdi:calendar" />
                    Events
                  </a>
                </li>
                <li class="disabled">
                  <a @click="openTab(TabType.SETTINGS, association)">
                    <Icon name="mdi:cog" />
                    Settings
                  </a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
        <div class="flex flex-col gap-2 p-4" v-else>
          <div class="skeleton h-4 w-full"></div>
          <div class="skeleton h-4 w-full"></div>
          <div class="skeleton h-4 w-full"></div>
        </div>
        <!-- Main Content -->
        <DashboardTabMain v-if="data" v-show="activeTab === TabType.DASHBOARD" />
        <DashboardTabMembers v-if="data" v-show="activeTab === TabType.MEMBERS" :association-id="activeAssociationId" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { data } = useFetch('/api/me/associations')

definePageMeta({
  title: 'Dashboard',
  middleware: ['authenticated'],
})

enum TabType {
  DASHBOARD = 'dashboard',
  MEMBERS = 'members',
  NEWS = 'news',
  EVENTS = 'events',
  SETTINGS = 'settings'
}

const activeTab = ref<TabType>(TabType.DASHBOARD)
const activeAssociation = ref<typeof data.value | null>(null)
const activeAssociationId = computed(() => activeAssociation.value?.id)

const openTab = (tab: TabType, association: typeof data.value) => {
  activeAssociation.value = association
  activeTab.value = tab
}

</script>

<style></style>
