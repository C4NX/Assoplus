<template>
  <div class="navbar bg-base-100 fixed z-10">
    <div class="navbar-start">
      <!-- Mobile Menu -->
      <div class="dropdown">
        <div tabIndex="0" role="button" class="btn btn-ghost lg:hidden">
          <Icon
            name="mdi:menu"
            size="24"
          />
        </div>
        <ul
          tabIndex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
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
          <li v-if="loggedIn">
            <NuxtLinkLocale to="/dashboard">
              {{ $t('header.dashboard') }}
            </NuxtLinkLocale>
          </li>
          <li v-else>
            <NuxtLinkLocale
              to="/Login"
              class="font-bold"
            >
              {{ $t('header.login') }}
            </NuxtLinkLocale>
          </li>
          <I18nSwitcher inline />
        </ul>
      </div>
      <NuxtLinkLocale
        class="btn btn-ghost text-xl hidden lg:flex"
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

    <!-- Logo for mobile -->
    <div class="navbar-end lg:navbar-start lg:hidden">
      <NuxtLinkLocale
        class="btn btn-ghost text-xl lg:hidden"
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

    <!-- Desktop Menu -->
    <div class="navbar-end hidden lg:flex">
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
    </div>

    <!-- User Menu -->
    <div class="flex-none">
      <MainHeaderAvatar />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { loggedIn } = useUserSession()
</script>

<style></style>
