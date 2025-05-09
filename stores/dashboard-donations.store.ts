import { defineStore } from "pinia"

export const useDashboardDonationsStore = defineStore("dashboard-donation", {
  state: () => ({ }),
  actions: {
    async delete(donationId: number) {
      const data = await $fetch(`/api/donations/${donationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      return data
    },
  },
})
