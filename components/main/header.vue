<template>
  <div class="navbar bg-base-100 fixed z-10">
    <div class="flex-1">
      <NuxtLinkLocale class="btn btn-ghost text-xl" to="/">
        <img src="/logo.svg" alt="logo" class="w-10">
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
          <NuxtLinkLocale to="/Login" class="font-bold">
            {{ $t('header.login') }}
          </NuxtLinkLocale>
        </li>
      </ul>
      <div v-if="loggedIn" class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <NuxtImg :src="user?.avatarUuid ? `/api/me/avatar/${user?.avatarUuid}` : undefined"
              placeholder="/image/avatar/default.jpg" alt="Avatar de l'utilisateur" />
          </div>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <li>
            <NuxtLinkLocale class="justify-between" to="/profile/me">
              {{ user?.firstName }} {{ user?.lastName }}
              <span v-if="user?.roles?.includes('ROLE_ADMIN')" class="badge badge-error badge-outline">Admin</span>
              <span v-if="user?.discordId" class="badge badge-info badge-outline">Discord</span>
            </NuxtLinkLocale>
          </li>
          <li><a @click.prevent="handleLogout()">Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { loggedIn, user } = useUserSession()
const accountStore = useAccountStore()

const handleLogout = async () => {
  await accountStore.logout()
}
</script>

<style></style>
