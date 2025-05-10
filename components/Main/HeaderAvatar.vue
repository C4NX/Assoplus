<template>
  <div
    v-if="user"
    class="dropdown dropdown-end"
  >
    <div
      tabindex="0"
      role="button"
      class="btn btn-ghost btn-circle avatar"
    >
      <div class="w-10 rounded-full">
        <img
          :src="user?.avatarUuid ? `/api/me/avatar/${user?.avatarUuid}` : '/image/avatar/default.jpg'"
          alt="Avatar de l'utilisateur"
        >
      </div>
    </div>
    <ul
      tabindex="0"
      class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
    >
      <li>
        <a
          class="justify-between"
          @click.prevent="handleProfile()"
        >
          {{ user?.firstName }} {{ user?.lastName }}
          <span
            v-if="user?.roles?.includes('ROLE_ADMIN')"
            class="badge badge-error badge-outline"
          >Admin</span>
        </a>
      </li>
      <li>
        <button
          @click.prevent="handleNotification()"
        >
          <Icon
            name="mdi:email"
            size="18"
            class="mr-1"
          />
          {{ $t("header.notifications") }}
        </button>
      </li>
      <li>
        <button @click.prevent="handleLogout()">
          <Icon
            name="mdi:logout"
            size="18"
            class="mr-1"
          />
          {{ $t("header.logout") }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
const accountStore = useAccountStore()
const profileStore = useProfileStore()
const localPath = useLocalePath()
const { user } = useUserSession()

const handleLogout = async () => {
  await accountStore.logout()
}

const handleNotification = () => {
  profileStore.setActiveTab(ProfileTab.NOTIFICATIONS)
  navigateTo(localPath("/profile/me"))
}

const handleProfile = () => {
  profileStore.setActiveTab(ProfileTab.INFO)
  navigateTo(localPath("/profile/me"))
}
</script>

<style>

</style>
