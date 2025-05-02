import { defineStore } from "pinia"

export interface DashboardNewsModalReactive {
  id: number
  title: string
  content: string
  status: string
}

export const useDashboardNewsStore = defineStore("dashboard-news", {
  state: (): {
    isModalOpen: boolean
    isModalEdit: boolean
    modalFormData: DashboardNewsModalReactive
  } => ({
    isModalOpen: false,
    isModalEdit: false,
    modalFormData: {
      id: 0,
      title: "",
      content: "",
      status: "DRAFT",
    },
  }),
  actions: {
    openEdit(news: DashboardNewsModalReactive) {
      this.isModalEdit = true
      this.isModalOpen = true
      this.modalFormData = news
      console.log("openEdit", this.modalFormData)
    },

    openCreate() {
      this.isModalEdit = false
      this.isModalOpen = true
      this.resetFormData()
    },

    closeModal() {
      this.isModalOpen = false
      this.isModalEdit = false
      this.resetFormData()
    },

    resetFormData() {
      this.modalFormData = {
        id: 0,
        title: "",
        content: "",
        status: "DRAFT",
      }
    },

    async createNews(associationId: string, news: { title: string, content: string, status: string }) {
      const data = await $fetch(`/api/association/${associationId}/news`, {
        method: "POST",
        body: JSON.stringify(news),
        headers: {
          "Content-Type": "application/json",
        },
      })
      return data
    },

    async deleteNews(associationId: string, newsId: number) {
      await $fetch(`/api/association/${associationId}/news/${newsId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
    },

    async updateNews(associationId: string, newsId: number, updates: Partial<DashboardNewsModalReactive>) {
      const data = await $fetch(`/api/association/${associationId}/news/${newsId}`, {
        method: "PATCH",
        body: updates,
        headers: {
          "Content-Type": "application/json",
        },
      })
      return data
    },
  },
})
