import { defineStore } from "pinia"
import { toast } from "vue3-toastify"
import type { UserPersonalInformation } from "~/shared/auth"
import { toastifyResponse } from "~/utils/toastify"

export const useAccountStore = defineStore("accounts", {
  state: (): object => ({
    // account is managed by nuxt-auth-utils
  }),
  actions: {
    /**
     * Login a user with email and password, refresh the session and redirect to the home page.
     * @param email The email of the user
     * @param password The password of the user
     * @returns {Promise<void>} A promise that resolves when the user is logged in
     */
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
    /**
     * Register a new user.
     * @param registerData Email and password of the new user
     * @returns {Promise<void>} A promise that resolves when the user is registered
     */
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
    /**
     * Clear the session and redirect to the home page.
     */
    async logout() {
      const router = useRouter()
      const { clear: clearSession } = useUserSession()

      await clearSession()
      await router.push("/")
    },
    /**
     * Update the user avatar and refresh the session. Note that an error toast is shown if an error occurs.
     * @param file The file instance to upload
     * @returns {Promise<void>} A promise that resolves when the avatar is updated
     */
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
    /**
     * Update the user informations.
     * @param informations The informations to update
     */
    async updateInformations(informations: UserPersonalInformation) {
      const { fetch: refresh, user } = useUserSession()

      await $fetch("/api/me", {
        method: "PATCH",
        body: {
          firstName: user.value?.firstName === informations.firstName ? undefined : informations.firstName,
          lastName: user.value?.lastName === informations.lastName ? undefined : informations.lastName,
          email: user.value?.email === informations.email ? undefined : informations.email,
          // birthdate: user.value?.birthdate === informations.birthdate ? undefined : informations.birthdate,
          // phone: user.value?.phone === informations.phone ? undefined : informations.phone,
        },
        onResponse: toastifyResponse,
      })

      await refresh()
    },
    /**
     * Delete the user account, clear the session and redirect to the home page. Note that an error toast is shown if an error occurs.
     * @returns {Promise<void>} A promise that resolves when the account is deleted
     */
    async deleteAccount() {
      const { loggedIn, fetch: refreshSession } = useUserSession()
      if (!loggedIn) {
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
