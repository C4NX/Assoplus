<template>
  <div class="mt-14 m-4 space-y-2">
    <h1 class="py-4 text-xl font-bold flex items-center justify-center gap-2 bg-base-200 rounded-md">
      <Icon
        name="mdi:user"
        size="24"
      />
      Mon compte
    </h1>
    <div class="flex flex-row gap-2">
      <ul class="menu bg-base-200 rounded-box w-56">
        <li>
          <a
            :class="{ active: activeTab === ProfileTab.INFO }"
            @click="activeTab = ProfileTab.INFO"
          >
            <Icon
              name="mdi:account"
              size="24"
            />
            Informations
          </a>
        </li>
        <li>
          <a
            :class="{ active: activeTab === ProfileTab.SECURITY }"
            @click="activeTab = ProfileTab.SECURITY"
          >
            <Icon
              name="mdi:lock"
              size="24"
            />
            Sécurité
          </a>
        </li>
        <li class="disabled">
          <a :class="{ active: activeTab === ProfileTab.NOTIFICATIONS }">
            <Icon
              name="mdi:email"
              size="24"
            />
            Notifications
          </a>
        </li>
      </ul>
      <div class="flex-1">
        <ProfileTabInformations v-if="activeTab === ProfileTab.INFO" />
        <ProfileTabSecurity v-if="activeTab === ProfileTab.SECURITY" />
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

<style>

</style>
