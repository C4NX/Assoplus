import { defineStore } from "pinia"
import { toast } from "vue3-toastify"
import type { FetchContext } from "ofetch"
import type { ClientUserInterface } from "~/shared/auth"
/**
 * Handle refresh token on 401 response.
 * @param context Fetch context
 */
export async function authOnResponseError(context: FetchContext) {
  console.log("authOnResponseError", context.response?.status)
  if (context.response?.status === 401) {
    const { refresh } = useAuthStore()
    if (await refresh()) {
      // retry the request with the new token
      context.options.retry = 1
      context.options.retryStatusCodes = [401]
    }
  }
}

export const useAuthStore = defineStore("auth", {
  state: (): {
    user: ClientUserInterface | null
    isLoading: boolean
  } => ({
    user: null,
    isLoading: true,
  }),
  actions: {
    async init() {
      try {
        await this.fetchUser()
      }
      catch (error) {
        console.error("Auth init error:", error)
        this.user = null
      }
      finally {
        this.isLoading = false
      }
    },
    async fetchUser() {
      const user = await $fetch("/api/me")
      this.user = user
    },
    async login(email: string, password: string) {
      const router = useRouter()
      const localePath = useLocalePath()

      const { user, message } = await $fetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
        onResponseError: [authOnResponseError],
      })

      console.log(this.user)
      this.user = user
      console.log(this.user)
      toast.success(message, { toastId: "login" })
      await router.push(localePath("/"))
    },
    async register(registerData: { email: string, password: string }) {
      const router = useRouter()
      const localePath = useLocalePath()

      await $fetch("/api/auth/register", {
        method: "POST",
        body: registerData,
        onResponseError: [
          authOnResponseError,
          async function ({ response }: FetchContext) {
            if ("message" in response?._data) {
              toast.error((response?._data.message))
            }
          },
        ],
      })

      await router.push(localePath("/login"))
    },
    async refresh() {
      try {
        await $fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        })
        return true
      }
      catch (error) {
        console.error(error)
        this.user = null
        return false
      }
    },
    async logout() {
      const router = useRouter()
      const localePath = useLocalePath()

      await $fetch("/api/auth/logout", {
        method: "POST",
        onResponseError: [
          authOnResponseError,
          async function ({ response }: FetchContext) {
            if ("message" in response?._data) {
              toast.error((response?._data.message))
            }
          },
        ],
      })

      this.user = null
      console.log("after logout", this.user)
      await router.push(localePath("/login"))
    },

    async updateAvatar(file: File) {
      if (!this.user) {
        return
      }

      const formData = new FormData()
      formData.append("file", file)

      try {
        const data = await $fetch("/api/me/avatar", {
          method: "POST",
          body: formData,
          onResponseError: [authOnResponseError],
        })
        this.user = { ...this.user, avatarUuid: data.uuid }
      }
      catch (error) {
        console.error(error)
      }
    },
  },
})
