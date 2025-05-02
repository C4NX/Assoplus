import { defineStore } from "pinia"

export enum DashboardTabType {
  HOME = "home",
  VOLUNTEER = "volunteer",
  CREATE = "create",
  INFORMATIONS = "informations",
  NEWS = "news",
  EVENTS = "events",
  SETTINGS = "settings",
}

export const useDashboardStore = defineStore("dashboard", {
  state: (): {
    activeAssociationId: Ref<string | undefined>
    activeTab: Ref<DashboardTabType>
    needAssociationListRefresh: Ref<boolean>
  } => ({
    activeAssociationId: ref(undefined),
    activeTab: ref(DashboardTabType.HOME),
    needAssociationListRefresh: ref(false),
  }),
  actions: {
    setTab(tab: DashboardTabType, associationId: string | undefined = undefined) {
      this.activeTab = tab
      this.activeAssociationId = associationId
    },
  },
})
