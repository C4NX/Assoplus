import { defineStore } from "pinia"

export const useAssociationsStore = defineStore("associations", {
  state: () => ({ }),
  actions: {
    async acceptInvite(inviteId: string) {
      return await $fetch("/api/invite/accept", {
        method: "GET", // GET because of invite by token (email)
        onResponse: toastifyResponse,
        params: { inviteId },
      })
    },
    async delete(associationId: string) {
      await $fetch(`/api/association/${associationId}`, {
        method: "DELETE",
        onResponse: toastifyResponse,
      })
    },
    async rejectInvite(inviteId: string) {
      return await $fetch("/api/invite/reject", {
        method: "POST",
        onResponse: toastifyResponse,
        body: {
          inviteId,
        },
      })
    },
  },
})
