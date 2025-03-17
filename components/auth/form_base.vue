<template>
  <div
    class="h-screen flex items-center justify-center bg-cover bg-center bg-[url('pexels-juan-pablo-guardia-137931772-18504011.jpg')]"
  >
    <div class="w-full h-full flex flex-col justify-center items-center backdrop-blur-lg px-4 md:px-0">
      <form
        class="card bg-base-100 shadow-xl p-8 flex gap-2 flex-col w-full md:w-1/3"
        @submit.prevent="handleLogin"
      >
        <div>
          <button
            class="btn btn-ghost btn-sm"
            @click="$router.back()"
          >
            <Icon
              name="mdi:arrow-left"
              size="16"
            />
            {{ $t("back") }}
          </button>
        </div>
        <h1 class="text-2xl mb-4 text-center font-extrabold uppercase tracking-widest">
          {{ $t(title) }}
        </h1>
        <slot />
        <div
          v-if="!hideOAuthLogin"
          class="flex flex-col gap-2"
        >
          <div class="divider">
            {{ $t("OR") }}
          </div>
          <button
            class="btn btn-secondary flex-1"
            disabled
          >
            <Icon name="mdi:google" />
            {{ $t("login.google") }}
          </button>
        </div>
        <p class="text-center">
          {{ $t("login.by_continuing_you_accept") }}
          <NuxtLinkLocale
            to="/terms"
            class="link"
          >
            {{ $t("login.terms_of_service") }}
          </NuxtLinkLocale> {{ $t("login.and") }}
          <NuxtLinkLocale
            to="/privacy"
            class="link"
          >
            {{ $t("login.privacy_policy") }}
          </NuxtLinkLocale>.
        </p>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  handleLogin: (payload: Event) => void
  title: string
  hideOAuthLogin?: boolean
}>()
</script>

<style></style>
