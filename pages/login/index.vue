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
        class="grow"
        :placeholder="$t('login.placeholder.password')"
        required
      >
    </label>
    <p class="text-right">
      <NuxtLink
        to="/login/reset"
        class="link link-secondary"
      >
        {{ $t("login.forgot_password") }}
      </NuxtLink>
    </p>
    <button
      class="btn btn-primary flex-1"
      type="submit"
    >
      {{ $t("login.submit") }}
    </button>
    <p class="text-center font-bold">
      {{ $t("login.no_account") }}
      <NuxtLink
        to="/register"
        class="text-secondary underline"
      >
        {{ $t("login.register") }}
      </NuxtLink>
    </p>
  </AuthFormBase>
</template>

<script lang="ts" setup>
import { toast } from "vue3-toastify"

const authStore = useAuthStore()
const { t } = useI18n()
const router = useRouter()

const loginForm = reactive({
  email: "",
  password: "",
})

useHead({
  title: t("login.title"),
})

const handleLogin = async () => {
  if (await authStore.login(loginForm.email, loginForm.password)) {
    toast.success(t("login.success"))
    router.push("/")
  }
  else {
    toast.error(t("login.error"))
  }
}
</script>

<style></style>
