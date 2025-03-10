<template>
  <div class="navbar bg-base-100 fixed z-10">
    <div class="flex-1">
      <NuxtLink
        class="btn btn-ghost text-xl"
        to="/"
      >
        <img
          src="/logo.svg"
          alt="logo"
          class="w-10"
        >
        Asso+
      </NuxtLink>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1 gap-2">
        <li>
          <NuxtLink to="/">{{ $t('header.home') }}</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/associations">{{ $t('header.associations') }}</NuxtLink>
        </li>
        <li v-if="!authStore.user">
          <NuxtLink to="/Login">{{ $t('header.login') }}</NuxtLink>
        </li>
      </ul>
      <I18nSwitcher />
      <div
        v-if="authStore.user"
        class="dropdown dropdown-end"
      >
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost btn-circle avatar"
        >
          <div class="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            >
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
        >
          <li>
            <a class="justify-between">
              Profile
              <span class="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a @click.prevent="handleLogout()">Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toast } from "vue3-toastify"
import { I18nSwitcher } from "#components"

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  authStore.logout()
  router.push("/")
  toast.success("Logout successful", {
    delay: 200,
  })
}
</script>

<style></style>
