import { defineStore } from 'pinia'

interface VolunteerFormData {
  id: number
  roles: string[]
  user: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
}

interface VolunteerUpdate {
  id: number
  roles: string[]
}

export const useDashboardVolunteersStore = defineStore(
  'dashboard-volunteers', {
    state: () => ({
      isInviteModalOpen: ref(false),
      isFormModalOpen: ref(false),
      inviteModalEmail: ref(''),
      formModalData: ref<VolunteerFormData | null>(null),
    }),
  actions: {
    openInviteModal() {
      this.isInviteModalOpen = true
    },

    closeInviteModal() {
      this.isInviteModalOpen = false
      this.inviteModalEmail = ''
    },

    openFormModal(formData: VolunteerFormData) {
      this.formModalData = formData
      this.isFormModalOpen = true
    },

    closeFormModal() {
      this.isFormModalOpen = false
      this.formModalData = null
    },

    async inviteVolunteer({ associationId, email}: { associationId: string, email: string }) {
      const data = await $fetch(`/api/invite`, {
        method: "POST",
        body: {
          associationId,
          email,
        },
        onResponse: toastifyResponse,
        headers: {
          "Content-Type": "application/json",
        },
      })
      return data
    },
    async deleteVolunteer(volunteerId: number) {
      const data = await $fetch(`/api/volunteers/${volunteerId}`, {
        method: "DELETE",
        onResponse: toastifyResponse,
        headers: {
          "Content-Type": "application/json",
        },
      })
      return data
    },

    async updateVolunteer(updates: VolunteerUpdate) {
      const data = await $fetch(`/api/volunteers/${updates.id}`, {
        method: "PATCH",
        body: {
          roles: updates.roles,
        },
        onResponse: toastifyResponse,
        headers: {
          "Content-Type": "application/json",
        },
      })
      return data
    },
  }
})
