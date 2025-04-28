<template>
  <DashboardTabModalEditNews 
    :edit="isModalEdit"
    :association-id="associationId"
    v-model="isModalOpen"  
    @on-save="handleModalSave"
  />
  <div class="flex justify-end items-center mb-4">
    <button class="btn btn-primary" @click="openCreateModal">Créer une news</button>
  </div>
  <UtilsLoading :status="status">
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th></th>
            <th>Titre</th>
            <th>Auteur.ice</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in (data?.items || [])" :key="index">
            <th>{{ index + 1 }}</th>
            <td>{{ item.title }}</td>
            <td>{{ item.author }}</td>
            <td>{{ item.createdAt }}</td>
          </tr>
          <tr v-if="data?.items.length === 0">
            <td colspan="4" class="text-center">Aucune news disponible</td>
          </tr>
        </tbody>
      </table>
    </div>
  </UtilsLoading>
</template>

<script lang="ts" setup>

const props = defineProps({
  associationId: {
    type: String,
    required: false
  }
})

const associationId = computed(() => props.associationId)
const isModalOpen = ref(false)
const isModalEdit = ref(false)
const { data, refresh, status } = useFetch(() => `/api/association/${associationId.value}/news`)

const openCreateModal = () => {
  isModalEdit.value = false
  isModalOpen.value = true
}

const handleModalSave = async () => {
  await refresh()
}

</script>

<style>

</style>