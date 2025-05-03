import { defineStore } from 'pinia'

export interface DashboardVolunteersFormData {
  id?: number
  email: string
  firstName: string
  lastName: string
  isVerified?: boolean
  isPending?: boolean

  userId?: string
  associationId?: string
}

const defaultFormDataFactory: () => DashboardVolunteersFormData = () => ({
  id: 0,
  email: '',
  firstName: '',
  lastName: '',
  isVerified: false,
  isPending: false,
  userId: '',
})

export const useDashboardVolunteersStore = defineStore(
  'dashboard-volunteers', {
    state: (): {
      isModalOpen: boolean
      isModalEdit: boolean
      modalFormData: DashboardVolunteersFormData
    } => ({
      isModalOpen: false,
      isModalEdit: false,
      modalFormData: defaultFormDataFactory(),
    }),
  actions: {
    openCreate() {
      this.isModalEdit = false
      this.isModalOpen = true
      this.resetFormData()
    },

    openEdit(volunteer: DashboardVolunteersFormData) {
      this.isModalEdit = true
      this.isModalOpen = true
      this.modalFormData = volunteer
    },

    closeModal() {
      this.isModalOpen = false
      this.isModalEdit = false
      this.resetFormData()
    },

    resetFormData() {
      this.modalFormData = defaultFormDataFactory()
    },

    async createVolunteer(volunteers: DashboardVolunteersFormData) {
      const data = await $fetch(`/api/volunteer`, {
        method: "POST",
        body: volunteers,
        onResponse: toastifyResponse,
        headers: {
          "Content-Type": "application/json",
        },
      })
      return data
    }
  }
})
