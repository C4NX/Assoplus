import { defineStore } from "pinia"

export enum ProfileTab {
  INFO = "info",
  SECURITY = "security",
  NOTIFICATIONS = "notifications",
}

export const useProfileStore = defineStore("profile", {
  state: () => ({
    activeTab: ProfileTab.INFO,
  }),
  actions: {
    setActiveTab(tab: ProfileTab) {
      this.activeTab = tab
    },
  },
})
