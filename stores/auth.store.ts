import { defineStore } from "pinia"
import { toast } from "vue3-toastify"
import type { FetchContext } from "ofetch"

export const useAuthStore = defineStore("auth", {
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
        onResponseError: [
          async function ({ response }: FetchContext) {
            if ("message" in response?._data) {
              toast.error((response?._data.message))
            }
          },
        ],
      })

      await refreshSession()
      toast.success(message, { toastId: "login" })
      await router.push(localePath("/"))
    },
    async register(registerData: { email: string, password: string }) {
      const router = useRouter()
      const localePath = useLocalePath()
      const nuxtApp = useNuxtApp()

      await $fetch("/api/auth/register", {
        method: "POST",
        body: registerData,
        onResponseError: [
          async function ({ response }: FetchContext) {
            if ("message" in response?._data) {
              toast.error((response?._data.message))
            }
          },
        ],
      })

      await nuxtApp.runWithContext(async () => await router.push(localePath("/login")))
    },
    async logout() {
      const router = useRouter()
      const { clear: clearSession } = useUserSession()

      await clearSession()
      await router.push("/")
    },
    async updateAvatar(file: File) {
      const nuxtApp = useNuxtApp()
      const { loggedIn, fetch: refreshSession, user } = useUserSession()
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
      catch (error) {
        console.error(error)
      }
    },
  },
})
