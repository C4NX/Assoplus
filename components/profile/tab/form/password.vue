<template>
  <form
    class="grid grid-cols-1 gap-2"
    @submit.prevent="handleSubmitUpdatePassword"
  >
    <div class="flex flex-col gap-2">
      <label for="current-password">Mot de passe actuel</label>
      <input
        id="current-password"
        v-model="passwordChangeForm.currentPassword"
        type="password"
        class="input"
        :disabled="isLoading"
      >
    </div>
    <div class="flex flex-col gap-2">
      <label for="new-password">Nouveau mot de passe</label>
      <input
        id="new-password"
        v-model="passwordChangeForm.newPassword"
        type="password"
        class="input"
        :disabled="isLoading"
      >
    </div>
    <div class="flex flex-col gap-2">
      <label for="confirm-password">Confirmer le nouveau mot de passe</label>
      <input
        id="confirm-password"
        v-model="passwordChangeForm.confirmNewPassword"
        type="password"
        class="input"
        :disabled="isLoading"
      >
    </div>
    <div class="flex justify-end">
      <button
        class="btn btn-primary text-neutral-content"
        type="submit"
        :disabled="isLoading"
      >
        <Icon
          name="mdi:content-save"
          size="24"
        />
        Enregistrer le mot de passe
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { toast } from "vue3-toastify"
import { toastifyResponse } from "~/utils/toastify"

const { t } = useI18n()

const passwordChangeForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
})

const isLoading = ref(false)

const handleSubmitUpdatePassword = async () => {
  if (passwordChangeForm.newPassword !== passwordChangeForm.confirmNewPassword) {
    return toast.error(t("profile.error.password_does_not_match"))
  }

  isLoading.value = true
  await $fetch("/api/me/password", {
    method: "POST",
    body: {
      password: passwordChangeForm.currentPassword,
      newPassword: passwordChangeForm.newPassword,
    },
    onResponse: toastifyResponse,
  }).finally(() => {
    isLoading.value = false
  })
}
</script>
