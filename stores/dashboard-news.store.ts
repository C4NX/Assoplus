import { defineStore } from "pinia"

export interface NewsData {
  id: number
  title: string
  content: string
  status: string
}

export interface NewsCreate extends Omit<NewsData, "id"> {
  associationId: string
}

export interface NewsUpdate extends Partial<NewsData> {
  id: number
}

const defaultFormDataFactory: () => NewsData = () => ({
  id: 0,
  title: "",
  content: "",
  status: "DRAFT",
})

export const useDashboardNewsStore = defineStore("dashboard-news", {
  state: (): {
    isModalOpen: boolean
    isModalEdit: boolean
    modalFormData: NewsData
  } => ({
    isModalOpen: false,
    isModalEdit: false,
    modalFormData: defaultFormDataFactory(),
  }),
  actions: {
    openEdit(news: NewsData) {
      this.isModalEdit = true
      this.isModalOpen = true
      this.modalFormData = news
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
      this.modalFormData = defaultFormDataFactory()
    },

    async createNews(news: NewsCreate) {
      const data = await $fetch(`/api/news`, {
        method: "POST",
        body: news,
        headers: {
          "Content-Type": "application/json",
        },
      })
      return data
    },

    async editNews(news: NewsData) {
      const data = await $fetch(`/api/news`, {
        method: "PATCH",
        body: {
          ...news,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      return data
    },

    async deleteNews(newsId: number) {
      await $fetch(`/api/news/${newsId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
    },

    async updateNews(updates: NewsUpdate) {
      const { id, ...updateData } = updates
      const data = await $fetch(`/api/news/${id}`, {
        method: "PATCH",
        body: updateData,
        headers: {
          "Content-Type": "application/json",
        },
      })
      return data
    },
  },
})
