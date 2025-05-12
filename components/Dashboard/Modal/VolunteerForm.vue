<template>
  <input
    v-model="isFormModalOpen"
    type="checkbox"
    class="modal-toggle"
  >
  <form
    class="modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    @submit.prevent="handleSubmit"
  >
    <div class="modal-box">
      <h3
        id="modal-title"
        class="font-bold text-lg"
      >
        Modifier le bénévole {{ formModalData?.user?.firstName }} {{ formModalData?.user?.lastName }}
      </h3>

      <div class="py-4">
        <InputMultiSelect
          v-model="selectedRoles"
          :options="options"
          size="md"
        />
      </div>

      <div class="modal-action">
        <button
          type="submit"
          class="btn btn-primary"
        >
          Sauvegarder
        </button>
        <button
          type="button"
          class="btn"
          @click="dashboardVolunteerStore.closeFormModal()"
        >
          Close
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { toast } from "vue3-toastify"

const selectedRoles = ref<{ label: string, value: string }[]>([])
const dashboardVolunteerStore = useDashboardVolunteersStore()

const {
  isFormModalOpen,
  formModalData,
} = storeToRefs(dashboardVolunteerStore)

// Watch for changes in formModalData and update selectedRoles accordingly
watch(formModalData, (newValue) => {
  if (newValue) {
    selectedRoles.value = newValue.roles
      .map(role => options.find(option => option.value === role))
      .filter(option => option !== undefined)
  }
})

const props = defineProps({
  associationId: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(["success"])

const handleSubmit = async () => {
  if (!props.associationId) {
    toast.error("Aucune association sélectionnée")
    return
  }

  if (formModalData.value === null) {
    toast.error("Aucun bénévole sélectionné")
    return
  }

  if (!selectedRoles.value.length) {
    toast.error("Veuillez sélectionner au moins un rôle")
    return
  }

  await dashboardVolunteerStore.updateVolunteer({
    id: formModalData.value?.id,
    roles: selectedRoles.value.map(role => role.value),
  })

  await dashboardVolunteerStore.closeFormModal()
  emit("success")
}

const options = [
  { label: "Volontaire", value: "VOLUNTEER" },
  { label: "Trésorier", value: "TREASURER" },
  { label: "Rédacteur", value: "WRITER" },
  { label: "Président", value: "PRESIDENT" },
]
</script>
