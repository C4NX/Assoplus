import { defineStore } from "pinia"
import { toast } from "vue3-toastify"
import { toastifyResponse } from "~/utils/toastify"

export const useAccountStore = defineStore("accounts", {
  state: (): object => ({
    // auth is managed by nuxt-auth-utils
  }),
  actions: {
    login: async (email: string, password: string) => {
      const { fetch: refreshSession } = useUserSession()
      const router = useRouter()
      const localePath = useLocalePath()

      const { message } = await $fetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
        onResponseError: toastifyResponse,
      })

      await refreshSession()
      toast.success(message, { toastId: "login" })
      await router.push(localePath("/"))
    },
    async register(registerData: { email: string, password: string }) {
      const router = useRouter()
      const localePath = useLocalePath()
      const nuxtApp = useNuxtApp()

      const result = await $fetch("/api/auth/register", {
        method: "POST",
        body: registerData,
        onResponseError: toastifyResponse,
      })

      await nuxtApp.runWithContext(async () => {
        await router.push(localePath("/login"))
        toast.success(result.message, { toastId: "register" })
      })
    },
    async logout() {
      const router = useRouter()
      const { clear: clearSession } = useUserSession()

      await clearSession()
      await router.push("/")
    },
    async updateAvatar(file: File) {
      const nuxtApp = useNuxtApp()
      const { loggedIn, fetch: refreshSession } = useUserSession()
      if (!loggedIn) {
        await nuxtApp.runWithContext(async () => await toast.error("You need to be logged to do this action"))
        return
      }

      const formData = new FormData()
      formData.append("file", file)

      try {
        await $fetch("/api/me/avatar", {
          method: "POST",
          body: formData,
        })
        await refreshSession()
      }
      catch {
        toast.error("An error occured while updating your avatar")
      }
    },
    async deleteAccount() {
      const nuxtApp = useNuxtApp()
      const { loggedIn, fetch: refreshSession } = useUserSession()
      if (!loggedIn) {
        await nuxtApp.runWithContext(async () => await toast.error("You need to be logged to do this action"))
        return
      }

      try {
        await $fetch("/api/me", {
          method: "DELETE",
        })
        await refreshSession()
      }
      catch {
        toast.error("An error occured while deleting your account")
      }
    },
  },
})
