import { defineStore } from 'pinia'

export const useNewsStore = defineStore("news", {
  state: () => ({ }),
  actions: {
    async createNews(associationId: string, news: { title: string, content: string, status: string }) {
      const data = await $fetch(`/api/association/${associationId}/news`, {
        method: "POST",
        body: {
          title: news.title,
          content: news.content,
          status: news.status,
        },
        onResponse: toastifyResponse,
        headers: {
          "Content-Type": "application/json",
        },
      })
      console.log("createNews", data)
      return data
    },
    async updateNews() {
    },
  }
})
