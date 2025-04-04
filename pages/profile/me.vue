<template>
  <div class="min-h-[calc(100vh-60px)] pt-[60px] bg-grid">
    <ClientOnly>
      <dialog
        ref="modalDialog"
        class="modal"
      >
        <div class="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 class="text-lg font-bold">
            {{ $t('profile.picture.change') }}
          </h3>
          <p class="py-4">
            <VuePictureCropper
              v-if="cropperUrl"
              :img="cropperUrl"
              :box-style="{
                width: '100%',
                height: '100%',
                backgroundColor: '#f8f8f8',
                margin: 'auto',
              }"
              :options="{
                viewMode: 1,
                dragMode: 'move',
                aspectRatio: 1,
                cropBoxResizable: true,
              }"
              :preset-mode="{
                mode: 'round',
                width: 512,
                height: 512,
              }"
            />
          </p>
          <div class="flex justify-end gap-2">
            <button
              class="btn"
              @click.prevent="modalDialog?.close()"
            >
              {{ $t('cancel') }}
            </button>
            <button
              class="btn btn-primary"
              :disabled="isUpdatingAvatar"
              @click="changeAvatarWithCroppedImage"
            >
              {{ $t('save') }}
            </button>
          </div>
        </div>
      </dialog>
    </ClientOnly>
    <div
      v-if="loggedIn"
      class="w-full h-40 bg-rainbow bg-cover bg-center border-b-8 border-gray-100"
    >
      <div class="avatar relative top-1/2 left-1/4">
        <div
          class="w-32 h-32 rounded-full border-4 border-white cursor-pointer"
          @click="handleAvatarUpload"
        >
          <input
            ref="avatarInput"
            type="file"
            accept="image/*"
            class="hidden"
          >
          <img
            :src="user?.avatarUuid ? `/api/me/avatar/${user?.avatarUuid}` : '/image/avatar/default.jpg'"
            alt="Avatar de l'utilisateur"
          >
        </div>
      </div>
    </div>
    <div
      v-else
      class="skeleton h-32 w-full m-2 p-2"
    />
    <ProfileContainer />
  </div>
</template>

<script lang="ts" setup>
import VuePictureCropper, { cropper } from "vue-picture-cropper"
import { toast } from "vue3-toastify"

definePageMeta({
  name: "Profile",
  middleware: ["authenticated"],
})

const accountStore = useAccountStore()
const { loggedIn, user } = useUserSession()
const { t } = useI18n()
const cropperUrl = ref<string | null>(null)
const avatarInput = ref<HTMLInputElement | null>(null)
const modalDialog = ref<HTMLDialogElement | null>(null)
const isUpdatingAvatar = ref(false)

const handleAvatarUpload = async () => {
  if (!avatarInput.value) return

  try {
    // 1. Open file dialog
    avatarInput.value.click()

    // 2. Wait for file selection
    const file = await new Promise<File>((resolve) => {
      avatarInput.value?.addEventListener("change", (e) => {
        resolve((e?.target as HTMLInputElement)?.files?.[0] as File)
      }, { once: true })
    })

    if (!file) return

    // 3. Validate image
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select a valid image")
    }

    openCropper(file)
  }
  catch (error) {
    console.error(error)
  }
}

function openCropper(file: File) {
  cropperUrl.value = ""

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    // Update the picture source of the `img` prop
    cropperUrl.value = String(reader.result)

    // Show the modal
    modalDialog.value?.showModal()

    // Clear selected files of input element
    if (!avatarInput.value) return
    avatarInput.value.value = ""
  }
}

const changeAvatarWithCroppedImage = async () => {
  if (!cropper) return

  const file = await cropper.getFile({
    fileName: "avatar",
  })
  if (!file) return

  try {
    isUpdatingAvatar.value = true
    await accountStore.updateAvatar(file)
  }
  catch {
    toast.error(t("profile.picture.error"))
  }
  finally {
    isUpdatingAvatar.value = false
  }

  modalDialog?.value?.close()
  toast.success(t("profile.picture.success"))
}
</script>

<style></style>
