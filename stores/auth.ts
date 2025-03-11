import { defineStore } from "pinia"

interface UserInterface {
  id: string
  email: string
  firstName: string
  lastName: string
}

export const useAuthStore = defineStore("authStore", {
  state: (): {
    user: UserInterface | null
    token: string | null
    refreshToken: string | null
  } => ({
    user: null,
    token: null,
    refreshToken: null,
  }),
  actions: {
    async login(email: string, password: string): Promise<boolean> {
      try {
        const result = await $fetch("/api/auth/token", {
          method: "POST",
          body: { email, password },
          headers: {
            "Content-Type": "application/json",
          },
        })

        this.user = result.user
        this.token = result.token
        this.refreshToken = result.refreshToken

        console.log(result)
        return true
      }
      catch (e) {
        console.error(e)
        return false
      }
    },
    logout() {
      this.user = null
      this.token = null
      this.refreshToken = null
    },
  },
})
