<template>
  <form
    class="grid grid-cols-1 gap-2"
    @submit.prevent="handleSubmitUpdatePassword"
  >
    <!-- Current password -->

    <label
      class="form-control w-full"
      for="current-password"
    >
      <div class="label">
        <span class="label-text">
          {{ $t("profile.security.password_form.current_password") }}
        </span>
        <span class="label-text-alt text-error">
          *
        </span>
      </div>
      <input
        id="current-password"
        v-model="passwordChangeForm.currentPassword"
        type="password"
        class="input input-bordered"
        :disabled="isLoading"
      >
    </label>

    <!-- New password -->
    <label
      class="form-control w-full"
      for="new-password"
    >
      <div class="label">
        <span class="label-text">
          {{ $t("profile.security.password_form.new_password") }}
        </span>
        <span class="label-text-alt text-error">
          *
        </span>
      </div>
      <input
        id="new-password"
        v-model="passwordChangeForm.newPassword"
        type="password"
        class="input input-bordered"
        :disabled="isLoading"
      >
    </label>

    <!-- Confirm new password -->
    <label
      class="form-control w-full"
      for="confirm-password"
    >
      <div class="label">
        <span class="label-text">
          {{ $t("profile.security.password_form.confirm_new_password") }}
        </span>
        <span class="label-text-alt text-error">
          *
        </span>
      </div>
      <input
        id="confirm-password"
        v-model="passwordChangeForm.confirmNewPassword"
        type="password"
        class="input input-bordered"
        :disabled="isLoading"
      >
    </label>

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
        {{ $t("profile.security.password_form.submit") }}
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
