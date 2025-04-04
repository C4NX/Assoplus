<template>
  <AuthFormBase
    title="login.reset.title"
    :handle-login="handleReset"
    :hide-o-auth-login="true"
  >
    <label
      v-if="!token"
      class="input input-bordered flex items-center gap-2"
    >
      <Icon name="mdi:email" />
      <input
        v-model="email"
        type="email"
        class="grow"
        :placeholder="$t('login.placeholder.email')"
        required
      >
    </label>
    <label
      v-if="token"
      class="input input-bordered flex items-center gap-2"
    >
      <Icon name="mdi:lock" />
      <input
        v-model="resetForm.password"
        type="password"
        class="grow"
        :placeholder="$t('login.placeholder.password')"
        required
      >
    </label>
    <label
      v-if="token"
      class="input input-bordered flex items-center gap-2"
    >
      <Icon name="mdi:lock" />
      <input
        v-model="resetForm.repeatPassword"
        type="password"
        class="grow"
        :placeholder="$t('login.placeholder.repeat_password')"
        required
      >
    </label>
    <button
      class="btn btn-primary flex-1"
      type="submit"
    >
      {{ $t("login.reset.submit") }}
    </button>
  </AuthFormBase>
</template>

<script lang="ts" setup>
import { toast } from "vue3-toastify"
import { toastifyResponse } from "~/utils/toastify"

const email = ref("")
const route = useRoute()
const router = useRouter()
const localPath = useLocalePath()
const { t } = useI18n()
const token = computed<string | undefined>(() => route.query.t as string | undefined)

const resetForm = reactive({
  password: "",
  repeatPassword: "",
})
const handleReset = async () => {
  if (!token.value) {
    await $fetch("/api/auth/password/forgot-password", {
      method: "POST",
      body: {
        email: email.value,
      },
      onResponse: toastifyResponse,
    })
    return
  }

  if (resetForm.password !== resetForm.repeatPassword) {
    return toast.error(t("login.error.password_does_not_match"))
  }

  await $fetch("/api/auth/password/reset", {
    method: "POST",
    body: {
      token: token.value,
      password: resetForm.password,
    },
    onResponse: toastifyResponse,
  })

  await router.push(localPath("/login"))
}
</script>

<style></style>
