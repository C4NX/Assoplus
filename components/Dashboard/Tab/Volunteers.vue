<template>
  <DashboardTabBase>
    <template #title>
      <Icon name="mdi:account-group" />
      {{ $t("dashboard.tabs.volunteers") }}
    </template>
    <DashboardTabModalEditVolunteer :association-id="activeAssociationId" @on-save="handleVolunteerSaved" />
    <UtilsLoading :status="status">
      <div class="flex justify-between items-center gap-4">
        <label class="input input-bordered input-md flex-1 flex items-center gap-2">
          <Icon name="mdi:magnify" class="w-5 h-5" />
          <input type=" text" class="grow" placeholder="Rechercher un membre" v-model="searchInput" />
        </label>
        <button class="btn btn-primary btn-md" @click="dashboardVolunteersStore.openCreate()">
          <Icon name="mdi:plus" class="w-5 h-5" />
          Ajouter un membre
        </button>
        <DashboardModalExportCsv :csv-url="`/api/association/${activeAssociationId}/volunteers`"
          file-name="volunteers.csv">
          <template #title>
            Exporter en CSV
          </template>
        </DashboardModalExportCsv>
      </div>
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th />
            <th>Nom / Prénom</th>
            <th>Rôle</th>
            <th>Asso+</th>
            <th>
              <div class="flex items-center gap-2">
                En attente ?
                <span class="tooltip tooltip-left"
                  data-tip="Un bénévole est en attente si il provient d'une demande d'adhésion et n'a pas encore été validé par l'association.">
                  <Icon name="mdi:help-circle" class="w-5 h-5" />
                </span>
              </div>
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="volunteer in data?.items" :key="volunteer.id">
            <th>
              1
            </th>
            <!-- Volunteer Name / Email -->
            <td>
              <div class="flex items-center gap-3">
                <div>
                  <div class="font-bold">
                    {{ volunteer.firstName }} {{ volunteer.lastName }}
                    <span v-if="volunteer.userId === user?.id" class="badge badge-secondary badge-outline badge-xs p-2">
                      Vous
                    </span>
                  </div>
                  <div class="text-sm opacity-50">
                    {{ volunteer.email }}
                  </div>
                </div>
              </div>
            </td>
            <!-- Role -->
            <td>
              <span class="badge badge-primary badge-outline">
                {{ volunteer.role }}
              </span>
            </td>
            <!--  Asso+ -->
            <td>
              <span class="badge badge-primary badge-outline" v-if="volunteer.userId !== null">
                <Icon name="mdi:check" class="w-5 h-5" />
                Oui
              </span>
              <span class="badge badge-error badge-outline" v-else>
                <Icon name="mdi:close" class="w-5 h-5" />
                Non
              </span>
            </td>
            <!-- Waiting for validation -->
            <td>
              <span class="badge badge-primary badge-outline" v-if="volunteer.isPending">
                <Icon name="mdi:check" class="w-5 h-5" />
                Oui
              </span>
              <span class="badge badge-error badge-outline" v-else>
                <Icon name="mdi:close" class="w-5 h-5" />
                Non
              </span>
            </td>
            <!-- Actions -->
            <td>
              <div class="flex gap-4 flex-col md:flex-row" v-if="volunteer.userId !== user?.id">
                <button class="btn btn-primary btn-sm" @click="() => dashboardVolunteersStore.openEdit(volunteer)">
                  <Icon name="mdi:pencil" />
                  Modifier
                </button>
                <button class="btn btn-error btn-sm">
                  <Icon name="mdi:trash-can" />
                  Supprimer
                </button>
                <button class="btn btn-sm btn-success">
                  <Icon name="mdi:check" />
                  Valider
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <InputPagination v-if="data?.totalPages" v-model="currentPage" :total-pages="data?.totalPages" />
    </UtilsLoading>
  </DashboardTabBase>
</template>

<script lang="ts" setup>
import { Icon } from '#components'

const { activeAssociationId } = useDashboardStore()
const dashboardVolunteersStore = useDashboardVolunteersStore()

const currentPage = ref(1)
const searchInput = ref<string|undefined>("")
const debouncedSearchInput = ref<string|undefined>("")

const { user } = useUserSession()

// Handle search input

let searchTimeout: ReturnType<typeof setTimeout>

watch(searchInput, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(async () => {
    currentPage.value = 1
    const inputTextLength = searchInput.value?.length ?? 0
    debouncedSearchInput.value = inputTextLength > 0 ? searchInput.value : undefined
  }, 500)
})

const { data, status, refresh } = useFetch(() => `/api/association/${activeAssociationId}/volunteers`, {
  params: {
    page: currentPage,
    search: debouncedSearchInput,
  },
})

const handleVolunteerSaved = async () => {
  currentPage.value = 1
  searchInput.value = ""
  await refresh({ dedupe: true })
}

</script>

<style>

</style>
