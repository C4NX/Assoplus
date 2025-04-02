<template>
  <div
    class="min-h-[calc(100vh-60px)] pt-[60px] flex items-center justify-center bg-cover bg-center bg-city"
  >
    <div
      class="w-full min-h-[calc(100vh-60px)] flex flex-col justify-center items-center backdrop-blur-lg px-4 md:px-0"
    >
      <form
        class="card bg-base-100 shadow-xl p-8 flex gap-2 flex-col w-full md:w-1/3"
        @submit.prevent="handleLogin"
      >
        <div>
          <button
            class="btn btn-ghost btn-sm"
            type="button"
            @click.prevent="handleBack()"
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
          <div class="flex gap-2 flex-col lg:flex-row">
            <button
              class="btn bg-white text-black border-[#e5e5e5] flex-1"
              type="button"
              @click.prevent="openProvider('google')"
            >
              <Icon name="logos:google-icon" />
              {{ $t("login.google") }}
            </button>
            <!-- <button
              class="btn btn-secondary flex-1"
              type="button"
              @click.prevent="openProvider('discord')"
            >
              <Icon name="mdi:discord" />
              {{ $t("login.discord") }}
            </button> -->
          </div>
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

const router = useRouter()
const localPath = useLocalePath()

const openProvider = (provider: string) => {
  window.location.href = `/api/auth/${provider}`
}

const handleBack = async () => {
  if (router.options.history.state.back) { // if router can go back
    router.back()
  } else {
    await router.push(localPath('/login'))
  }
}
</script>
