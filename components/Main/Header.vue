<template>
  <div class="navbar bg-base-100 fixed z-10">
    <div class="flex-1">
      <NuxtLinkLocale
        class="btn btn-ghost text-xl"
        to="/"
      >
        <img
          src="/logo.svg"
          alt="logo"
          class="w-10"
        >
        Asso+
      </NuxtLinkLocale>
    </div>
    <div class="flex-none">
      <I18nSwitcher />
      <ul class="menu menu-horizontal tracking-wide px-1 gap-2">
        <li>
          <NuxtLinkLocale to="/">
            {{ $t('header.home') }}
          </NuxtLinkLocale>
        </li>
        <li>
          <NuxtLinkLocale to="/associations">
            {{ $t('header.associations') }}
          </NuxtLinkLocale>
        </li>
        <li v-if="!loggedIn">
          <NuxtLinkLocale
            to="/Login"
            class="font-bold"
          >
            {{ $t('header.login') }}
          </NuxtLinkLocale>
        </li>
        <li v-else>
          <NuxtLinkLocale to="/dashboard">
            {{ $t('header.dashboard') }}
          </NuxtLinkLocale>
        </li>
      </ul>
      <div
        v-if="loggedIn"
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
              Notifications
            </button>
          </li>
          <li>
            <button @click.prevent="handleLogout()">
              <Icon
                name="mdi:logout"
                size="18"
                class="mr-1"
              />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ProfileTab, useProfileStore } from "~/stores/profile.store"

const { loggedIn, user } = useUserSession()
const accountStore = useAccountStore()
const profileStore = useProfileStore()
const localPath = useLocalePath()

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

<style></style>
