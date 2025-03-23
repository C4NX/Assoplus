<template>
  <div class="navbar bg-base-100 fixed z-10">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
    >
    <div class="flex-1">
      <NuxtLinkLocale
        class="btn btn-ghost text-xl"
        to="/"
      >
        <img
          src="/logo.svg"
          alt="logo"
          class="w-10"
        >
        Asso+
      </NuxtLinkLocale>
    </div>
    <div class="flex-none">
      <I18nSwitcher />
      <ul class="menu menu-horizontal tracking-wide px-1 gap-2">
        <li>
          <NuxtLinkLocale to="/">
            {{ $t('header.home') }}
          </NuxtLinkLocale>
        </li>
        <li>
          <NuxtLinkLocale to="/associations">
            {{ $t('header.associations') }}
          </NuxtLinkLocale>
        </li>
        <li v-if="!loggedIn">
          <NuxtLinkLocale
            to="/Login"
            class="font-bold"
          >
            {{ $t('header.login') }}
          </NuxtLinkLocale>
        </li>
      </ul>
      <div
        v-if="loggedIn"
        class="dropdown dropdown-end"
      >
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost btn-circle avatar"
        >
          <div class="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              :src="`/api/me/avatar/${user?.avatarUuid ?? 'default'}`"
            >
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
        >
          <li>
            <a class="justify-between">
              Profile
              <span
                v-if="user?.roles?.includes('ROLE_ADMIN')"
                class="badge badge-error badge-outline"
              >Admin</span>
              <span
                v-if="user?.discordId"
                class="badge badge-info badge-outline"
              >Discord</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a @click.prevent="handleUploadAvatar()">Change PP</a></li>
          <li><a @click.prevent="handleLogout()">Logout</a></li>
        </ul>
      </div>
    </div>
    <ClientOnly>
      <dialog
        id="my_modal_2"
        ref="modalDialog"
        class="modal"
      >
        <div class="modal-box">
          <h3 class="text-lg font-bold">
            Change your profile picture
          </h3>
          <p class="py-4">
            <VuePictureCropper
              v-if="cropperUrl"
              :img="cropperUrl"
              :options="{
                viewMode: 1,
                dragMode: 'crop',
                aspectRatio: 1,
              }"
            />
          </p>
          <div class="flex justify-end gap-2">
            <button
              class="btn"
              @click.prevent="modalDialog?.close()"
            >
              close
            </button>
            <button
              class="btn btn-primary"
              @click="getResult"
            >
              Save
            </button>
          </div>
        </div>
      </dialog>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import VuePictureCropper, { cropper } from "vue-picture-cropper"

const { loggedIn, user } = useUserSession()
const authStore = useAuthStore()

const cropperUrl = ref<string | null>(null)
const avatarResult = reactive({
  dataURL: "",
  blobURL: "",
})
const fileInput = ref<HTMLInputElement | null>(null)
const modalDialog = ref<HTMLDialogElement | null>(null)

const handleLogout = async () => {
  await authStore.logout()
}

const handleUploadAvatar = async () => {
  if (!fileInput.value) return

  try {
    // 1. Open file dialog
    fileInput.value.click()

    // 2. Wait for file selection
    const file = await new Promise<File>((resolve) => {
      fileInput.value?.addEventListener("change", (e) => {
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
  // Reset last selection and results
  cropperUrl.value = ""
  avatarResult.dataURL = ""
  avatarResult.blobURL = ""

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    // Update the picture source of the `img` prop
    cropperUrl.value = String(reader.result)

    // Show the modal
    modalDialog.value?.showModal()

    // Clear selected files of input element
    if (!fileInput.value) return
    fileInput.value.value = ""
  }
}

async function getResult() {
  if (!cropper) return
  const base64 = cropper.getDataURL()
  const blob: Blob | null = await cropper.getBlob()
  if (!blob) return

  const file = await cropper.getFile({
    fileName: "avatar",
  })
  if (!file) return

  console.log({ base64, blob, file })

  await authStore.updateAvatar(file)

  modalDialog?.value?.close()
}
</script>

<style></style>
