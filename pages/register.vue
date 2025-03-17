<template>
  <AuthFormBase
    :handle-login="handleRegister"
    title="register.title"
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
    <label class="input input-bordered flex items-center gap-2">
      <Icon name="mdi:account" />
      <input
        v-model="loginForm.firstName"
        type="text"
        class="grow"
        :placeholder="$t('login.placeholder.firstName')"
        required
      >
    </label>
    <label class="input input-bordered flex items-center gap-2">
      <Icon name="mdi:account" />
      <input
        v-model="loginForm.lastName"
        type="text"
        class="grow"
        :placeholder="$t('login.placeholder.lastName')"
        required
      >
    </label>
    <div class="flex gap-2">
      <button
        class="btn btn-primary flex-1"
        type="submit"
      >
        {{ $t("register.submit") }}
      </button>
    </div>
  </AuthFormBase>
</template>

<script lang="ts" setup>
const { register } = useAuthStore()
const { t } = useI18n()

const loginForm = reactive({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
})

useHead({
  title: t("register.title"),
})

const handleRegister = async () => {
  await register(loginForm)
}
</script>

<style></style>
