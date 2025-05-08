import { defineStore } from 'pinia'

export const useAssociationsStore = defineStore('associations',{
  state: () => ({ }),
  actions: {
    async acceptInvite(inviteId: string) {
      return await $fetch('/api/invite/accept', {
        method: 'GET', // GET because of invite by token (email) 
        params: { inviteId }
      })
    },
    async rejectInvite(inviteId: string) {
      return await $fetch('/api/invite/reject', {
        method: 'POST',
        body: { 
          inviteId
        }
      })
    }
  }
})
