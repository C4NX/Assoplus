<template>
  <ProfileTabBase
    title="profile.informations.title"
    icon="mdi:account"
  >
    <dialog
      ref="updateEmailModal"
      class="modal"
    >
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 class="text-lg font-bold">
          {{ $t("profile.informations.update_email") }}
        </h3>
        <p class="py-4">
          Voulez vous vraiment changer votre adresse email pour <strong>{{ informationsFormData.email }}</strong> ?
        </p>
        <div class="modal-action">
          <button
            class="btn btn-error text-neutral-content"
            @click.prevent="() => { updateEmailModal?.close(); isEmailChangeConfirmed = true; form?.requestSubmit() }"
          >
            Oui
          </button>
          <form method="dialog">
            <button class="btn">
              Annuler
            </button>
          </form>
        </div>
      </div>
    </dialog>
    <form
      ref="form"
      class="grid grid-cols-1 gap-4"
      @submit.prevent="handleSubmit"
    >
      <div class="flex flex-col gap-2">
        <label for="email">
          {{ $t("profile.informations.email") }}
        </label>
        <small class="text-xs italic text-warning">
          {{ $t("profile.informations.update_email_warning") }}
        </small>
        <input
          id="email"
          v-model="informationsFormData.email"
          type="email"
          class="input input-bordered"
          :disabled="isLoading || user?.googleId !== null"
        >
      </div>
      <div class="flex flex-col gap-2">
        <label for="firstname">
          {{ $t("profile.informations.firstname") }}
        </label>
        <input
          id="firstname"
          v-model="informationsFormData.firstName"
          type="text"
          class="input input-bordered"
          :disabled="isLoading"
        >
      </div>
      <div class="flex flex-col gap-2">
        <label for="lastname">
          {{ $t("profile.informations.lastname") }}
        </label>
        <input
          id="lastname"
          v-model="informationsFormData.lastName"
          type="text"
          class="input input-bordered"
          :disabled="isLoading"
        >
      </div>
      <!-- <div class="flex flex-col gap-2">
        <label for="phone">
          Téléphone
        </label>
        <input id="phone" type="tel" class="input input-bordered" :disabled="isLoading">
      </div>
      <div class="flex flex-col gap-2">
        <label for="birthdate">
          Date de naissance
        </label>
        <input id="birthdate" type="date" class="input input-bordered" :disabled="isLoading">
      </div> -->
      <div class="flex justify-end">
        <button
          class="btn btn-primary text-neutral-content"
          :disabled="!areProfileValuesModified"
          type="submit"
        >
          <Icon
            name="mdi:content-save"
            size="24"
          />
          {{ $t("common.save") }}
        </button>
      </div>
    </form>
  </ProfileTabBase>
</template>

<script lang="ts" setup>
import type { UserPersonalInformation } from "~/shared/auth"

const accountStore = useAccountStore()
const { user } = useUserSession()
const isLoading = ref(false)
const updateEmailModal = ref<HTMLDialogElement | null>(null)
const form = ref<HTMLFormElement | null>(null)
const isEmailChangeConfirmed = ref(false)
const informationsFormData = reactive<UserPersonalInformation>({
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  birthdate: "",
})

const areProfileValuesModified = computed(() => {
  return (
    informationsFormData.email !== user.value?.email
    || informationsFormData.firstName !== user.value?.firstName
    || informationsFormData.lastName !== user.value?.lastName
  )
})

const isEmailModified = computed(() => {
  return informationsFormData.email !== user.value?.email
})

// Refresh forms with new user informations
watch(() => user, (newUser) => {
  informationsFormData.email = newUser.value?.email ?? ""
  informationsFormData.firstName = newUser.value?.firstName ?? ""
  informationsFormData.lastName = newUser.value?.lastName ?? ""
}, { immediate: true })

const handleSubmit = async () => {
  if (isEmailModified.value && !isEmailChangeConfirmed.value) {
    updateEmailModal.value?.showModal()
    return
  }

  try {
    isLoading.value = true
    await accountStore.updateInformations(informationsFormData)
  }
  finally {
    isLoading.value = false
    isEmailChangeConfirmed.value = false
  }
}
</script>

<style>

</style>
