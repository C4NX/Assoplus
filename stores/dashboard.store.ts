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
  state: () => ({
    activeAssociationId: ref<string|undefined>(undefined), // Current association ID (opened in the dashboard)
    activeTab: ref<DashboardTabType>(DashboardTabType.HOME), // Current tab in the dashboard
    associations: ref<{ id: string, name: string, roles: string[] }[]>([]), // Associations the user is a member of
    needAssociationListRefresh: ref<boolean>(false), // Flag to refresh the association list
  }),
  actions: {
    setTab(tab: DashboardTabType, associationId: string | undefined = undefined) {
      this.activeTab = tab
      this.activeAssociationId = associationId
    },
    setAssociations(associations: { id: string, name: string, roles: string[] }[]) {
      this.associations = associations
    },
    hasRoleOnAssociation(associationId: string|undefined, role: string) {
      if(!associationId) return false
      
      const association = this.associations.find(association => association.id === associationId)
      
      // President role is like ADMIN for an association
      if(association?.roles.includes('PRESIDENT')) {
        return true
      }
      
      return association?.roles.includes(role) ?? false
    }
  },
})
