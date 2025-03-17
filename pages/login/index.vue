<template>
  <AuthFormBase
    :handle-login="handleLogin"
    title="login.title"
  >
    <label class="input input-bordered flex items-center gap-2">
      <Icon name="mdi:email" />
      <input
        v-model="loginForm.email"
        type="email"
        class="grow"
        :placeholder="$t('login.placeholder.email')"
        required
      >
    </label>
    <label class="input input-bordered flex items-center gap-2">
      <Icon name="mdi:lock" />
      <input
        v-model="loginForm.password"
        type="password"
        autocomplete="current-password"
        class="grow"
        :placeholder="$t('login.placeholder.password')"
        required
      >
    </label>
    <p class="text-right">
      <NuxtLinkLocale
        to="/login/reset"
        class="link link-secondary"
      >
        {{ $t("login.forgot_password") }}
      </NuxtLinkLocale>
    </p>
    <button
      class="btn btn-primary flex-1"
      type="submit"
    >
      {{ $t("login.submit") }}
    </button>
    <p class="text-center font-bold">
      {{ $t("login.no_account") }}
      <NuxtLinkLocale
        to="/register"
        class="text-secondary underline"
      >
        {{ $t("login.register") }}
      </NuxtLinkLocale>
    </p>
  </AuthFormBase>
</template>

<script lang="ts" setup>
const { login } = useAuthStore()
const { t } = useI18n()

const loginForm = reactive({
  email: "",
  password: "",
})

useHead({
  title: t("login.title"),
})

const handleLogin = async () => {
  await login(loginForm.email, loginForm.password)
}
</script>

<style></style>
