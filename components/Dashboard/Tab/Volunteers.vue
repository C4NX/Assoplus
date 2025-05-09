<template>
  <DashboardTabBase>
    <template #title>
      <Icon name="mdi:account-group" />
      {{ $t("dashboard.tabs.volunteers") }}
    </template>

    <!-- Volunteer invitation modal -->
    <DashboardModalInviteVolunteer :association-id="activeAssociationId" />

    <!-- Delete volunteer confirmation modal -->
    <ModalConfirm
      v-model="deleteConfirmModalOpen"
      :dangerous="true"
      @confirm="() => handleDeleteVolunteer(deleteVolunteerId)"
      @cancel="() => deleteVolunteerId = undefined"
    />

    <!-- Volunteer edit form modal -->
    <DashboardModalVolunteerForm
      :association-id="activeAssociationId"
      @success="handleVolunteerSaved"
    />

    <div class="flex justify-between items-center gap-4">
      <InputSearch
        v-model="searchInput"
        placeholder="Rechercher un membre"
        debounce
      />
      <button
        class="btn btn-primary btn-md"
        :disabled="status === 'pending'"
        @click="dashboardVolunteersStore.openInviteModal()"
      >
        <Icon
          name="mdi:plus"
          class="w-5 h-5"
        />
        Inviter
      </button>
      <DashboardModalExportCsv
        :csv-url="`/api/association/${activeAssociationId}/volunteers`"
        :disabled="status === 'pending'"
        file-name="volunteers.csv"
      >
        <template #title>
          Exporter en CSV
        </template>
      </DashboardModalExportCsv>
    </div>
    <UtilsLoading :status="status">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th />
            <th>Nom / Prénom</th>
            <th>Rôle(s)</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(volunteer, index) in data?.items"
            :key="volunteer.id"
          >
            <!-- Index -->
            <th>{{ (currentPage - 1) * (data?.itemPerPage || 10) + index + 1 }}</th>
            <!-- Volunteer Name / Email -->
            <td>
              <div class="flex items-center gap-3">
                <div>
                  <div
                    v-if="volunteer.user?.id === user?.id"
                    class="font-bold indicator"
                  >
                    <span class="indicator-item badge badge-secondary badge-xs p-2">Vous</span>
                    <span class="py-1">
                      {{ volunteer.user?.firstName }} {{ volunteer.user?.lastName }}
                    </span>
                  </div>
                  <span
                    v-else
                    class="font-bold"
                  >
                    {{ volunteer.user?.firstName }} {{ volunteer.user?.lastName }}
                  </span>
                  <div class="text-sm opacity-50">
                    {{ volunteer.user?.email }}
                  </div>
                </div>
              </div>
            </td>
            <!-- Role -->
            <td>
              <div class="flex items-center gap-2">
                <span
                  v-for="role in volunteer.roles"
                  :key="role"
                  class="badge badge-primary badge-outline"
                >
                  {{ role }}
                </span>
              </div>
            </td>
            <!-- Actions -->
            <td>
              <div
                v-if="volunteer.userId !== user?.id"
                class="flex gap-4 flex-col md:flex-row"
              >
                <button
                  class="btn btn-primary btn-sm"
                  @click="() => dashboardVolunteersStore.openFormModal(volunteer)"
                >
                  <Icon name="mdi:pencil" />
                  Modifier
                </button>
                <button
                  v-if="volunteer.user.id !== user?.id && hasRoleOnAssociation(activeAssociationId, $Enums.AssociationRole.PRESIDENT)"
                  class="btn btn-error btn-sm"
                  @click="() => {
                    deleteVolunteerId = volunteer.id
                    deleteConfirmModalOpen = true
                  }"
                >
                  <Icon name="mdi:trash-can" />
                  Supprimer
                </button>
                <!-- <button class="btn btn-sm btn-success">
                  <Icon name="mdi:check" />
                  Valider
                </button> -->
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <InputPagination
        v-if="data?.totalPages"
        v-model="currentPage"
        :total-pages="data?.totalPages"
      />
    </UtilsLoading>
  </DashboardTabBase>
</template>

<script lang="ts" setup>
import { $Enums } from "@prisma/client"

const { activeAssociationId, hasRoleOnAssociation } = useDashboardStore()
const dashboardVolunteersStore = useDashboardVolunteersStore()

const currentPage = ref(1)
const searchInput = ref<string | undefined>("")
const deleteConfirmModalOpen = ref(false)
const deleteVolunteerId = ref<number | undefined>(undefined)

const { user } = useUserSession()

const { data, status, refresh } = useFetch(() => `/api/association/${activeAssociationId}/volunteers`, {
  params: {
    page: currentPage,
    search: searchInput,
  },
})

const handleVolunteerSaved = async () => {
  currentPage.value = 1
  searchInput.value = ""
  await refresh({ dedupe: true })
}

const handleDeleteVolunteer = async (volunteerId: number | undefined) => {
  if (!volunteerId) {
    return
  }
  await dashboardVolunteersStore.deleteVolunteer(volunteerId)
  await refresh({ dedupe: true })
}
</script>

<style>

</style>
