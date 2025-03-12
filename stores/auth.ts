import { defineStore } from "pinia"
import type { FetchContext } from "ofetch"

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
    /**
     * Send an async request to the server to login
     * @param email user's email
     * @param password user's password
     * @returns true if the login was successful, false otherwise
     */
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
        return true
      }
      catch (e) {
        console.error(e)
        return false
      }
    },
    /**
     * Try to refresh the jwt token using the refresh token
     * @returns the new jwt token if the refresh was successful, null otherwise
     */
    async refresh(): Promise<string|null> {
      try {
        const refreshResult = await $fetch("/api/auth/refresh", {
          method: "POST",
          body: { refreshToken: this.refreshToken },
          headers: {
            "Content-Type": "application/json",
          },
          onResponseError: async ({ response }: FetchContext) => {
            if (response?.status === 401) {
              this.logout()
            }
          }
        })
        this.user = refreshResult.user
        this.token = refreshResult.token
        this.refreshToken = refreshResult.refreshToken
        return this.refreshToken
      } catch (e) {
        console.error(e)
        return null;
      }
    },
    logout() {
      this.user = null
      this.token = null
      this.refreshToken = null
    },
  },
})
