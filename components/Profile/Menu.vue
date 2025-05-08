<template>
  <div class="container mx-auto max-w-10xl my-10 p-4">
    <div class="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
      <!-- Sidebar Navigation -->
      <div class="bg-base-100 rounded-lg shadow-sm border border-gray-200">
        <ul class="divide-y divide-gray-100">
          <li>
            <a
              href="#"
              :class="[
                'flex items-center gap-4 p-4 transition-colors',
                activeTab === ProfileTab.INFO ? 'bg-primary-50 text-primary' : 'hover:bg-gray-50',
              ]"
              @click.prevent="activeTab = ProfileTab.INFO"
            >
              <Icon
                name="mdi:account"
                size="24"
              />
              <span class="text-sm font-medium">Informations</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              :class="[
                'flex items-center gap-4 p-4 transition-colors',
                activeTab === ProfileTab.SECURITY ? 'bg-primary-50 text-primary' : 'hover:bg-gray-50',
              ]"
              @click.prevent="activeTab = ProfileTab.SECURITY"
            >
              <Icon
                name="mdi:lock"
                size="24"
              />
              <span class="text-sm font-medium">Sécurité</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              class="flex items-center gap-4 p-4"
              @click.prevent="activeTab = ProfileTab.NOTIFICATIONS"
            >
              <Icon
                name="mdi:email"
                size="24"
              />
              <span class="text-sm font-medium">Notifications</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Content Area -->
      <div class="rounded-lg">
        <ProfileTabInformations v-if="activeTab === ProfileTab.INFO" />
        <ProfileTabSecurity v-if="activeTab === ProfileTab.SECURITY" />
        <ProfileTabNotifications v-if="activeTab === ProfileTab.NOTIFICATIONS" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
enum ProfileTab {
  INFO = "info",
  SECURITY = "security",
  NOTIFICATIONS = "notifications",
}

const activeTab = ref<ProfileTab>(ProfileTab.INFO)
</script>
