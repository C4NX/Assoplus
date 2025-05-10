<template>
  <!-- Modal for adding/editing donations -->
  <DashboardModalDonationsForm
    :association-id="associationId"
    @on-save="refresh()"
  />

  <div class="flex gap-2 flex-col sm:flex-row flex-wrap">
    <InputSearch
      v-model="searchInput"
      :placeholder="$t('dashboard.donations.search')"
      debounce
      size="md"
    />
    <InputButtonSort v-model="searchOrder" />
    <button
      class="btn btn-primary"
      @click="dashboardDonationsStore.openCreateModal()"
    >
      <Icon
        name="mdi:plus"
        class="w-5 h-5"
      />
      {{ $t('dashboard.donations.add') }}
    </button>

    <DashboardModalExportCsv
      :csv-url="`/api/association/${associationId}/donations`"
      :file-name="`donations-${associationId}.csv`"
    />
  </div>
  <UtilsLoading :status="status">
    <table
      v-if="data"
      class="table table-xs"
    >
      <thead>
        <tr>
          <th>ID de la donation</th>
          <th>Montant</th>
          <th>Date</th>
          <th>Auteur</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="donation in data.items"
          :key="donation.id"
        >
          <td>{{ donation.id }}</td>
          <td>{{ $n(Number(donation.amount), 'currency', { currency: donation.currency }) }}</td>
          <td> {{ $d(donation.createdAt, 'long') }}</td>
          <td>{{ donation.donorName }}</td>
          <td>
            <div class="flex gap-2">
              <button
                class="btn btn-secondary btn-xs"
                disabled
              >
                <Icon
                  name="mdi:eye"
                  class="w-4 h-4"
                />
              </button>
              <button
                class="btn btn-secondary btn-xs"
                @click="dashboardDonationsStore.openEditModal(donation)"
              >
                <Icon
                  name="mdi:pencil"
                  class="w-4 h-4"
                />
              </button>
              <button
                class="btn btn-error btn-xs"
                @click="handleDelete(donation.id)"
              >
                <Icon
                  name="mdi:delete"
                  class="w-4 h-4"
                />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td
            v-if="data?.totalPages"
            colspan="5"
          >
            <InputPagination
              v-model="currentPage"
              :total-pages="data.totalPages"
            />
          </td>
          <td
            v-else
            colspan="5"
          >
            <div class="flex items-center justify-center gap-2">
              <Icon
                name="mdi:information-outline"
                class="w-5 h-5"
              />
              {{ $t('dashboard.donations.no_donations') }}
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </UtilsLoading>
</template>

<script lang="ts" setup>
const dashboardDonationsStore = useDashboardDonationsStore()

const searchInput = ref<string | undefined>(undefined)
const searchOrder = ref<"asc" | "desc">("asc")
const currentPage = ref(1)

const props = defineProps({
  associationId: {
    type: String,
    required: true,
  },
})

const { data, status, refresh } = useFetch(
  () => `/api/association/${props.associationId}/donations`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    query: {
      search: searchInput,
      order: searchOrder,
      page: currentPage,
    },
  },
)

const handleDelete = async (donationId: number) => {
  await dashboardDonationsStore.deleteDonation(donationId)
  await refresh()
}
</script>

<style>

</style>
