<template>
  <div class="navbar bg-base-100 fixed z-10">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
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
        <li v-if="!user">
          <NuxtLinkLocale
            to="/Login"
            class="font-bold"
          >
            {{ $t('header.login') }}
          </NuxtLinkLocale>
        </li>
      </ul>
      <div
        v-if="user"
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
              :src="`/api/me/avatar/${user.avatarUuid ?? 'default'}`"
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
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a @click.prevent="handleUploadAvatar()">Change PP</a></li>
          <li><a @click.prevent="handleLogout()">Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const auth = useAuthStore()

const { user } = storeToRefs(useAuthStore())

const router = useRouter()
const fileInput = ref<HTMLInputElement | null>(null)

const handleLogout = async () => {
  await auth.logout()
  await router.push("/")
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

    await auth.updateAvatar(file)
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<style></style>
