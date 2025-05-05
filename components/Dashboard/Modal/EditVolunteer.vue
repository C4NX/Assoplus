<template>
  <input v-model="isModalOpen" type="checkbox" class="modal-toggle">
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="news-modal-content">
      <h3 class="news-modal-title">
        <Icon v-if="isModalEdit" name="mdi:pencil" />
        <Icon v-else name="mdi:plus" />
        {{ isModalEdit ? 'Modifier' : 'Ajouter' }} un bénévole
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- First Name -->
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">
              Prénom
            </span>
            <span class="label-text-alt text-error">*</span>
          </label>
          <input type="text" class="input input-bordered w-full" v-model="modalFormData.firstName"
            placeholder="Prénom" />
        </div>
        <!-- Last Name -->
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">
              Nom
            </span>
            <span class="label-text-alt text-error">*</span>
          </label>
          <input type="text" class="input input-bordered w-full" v-model="modalFormData.lastName" placeholder="Nom" />
        </div>
        <!-- Email -->
        <div class="form-control w-full md:col-span-2">
          <label class="label">
            <span class="label-text">
              Email
            </span>
            <span class="label-text-alt text-error">*</span>
          </label>
          <input type="email" class="input input-bordered w-full" v-model="modalFormData.email" placeholder="Email" />
        </div>
      </div>
      <div class="modal-action">
        <button class="btn btn-primary" @click="handleSave">
          Sauvegarder
        </button>
        <button class="btn" @click="dashboardVolunteersStore.closeModal()">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toast } from "vue3-toastify"

const dashboardVolunteersStore = useDashboardVolunteersStore()

const {
  isModalOpen,
  isModalEdit,
  modalFormData,
} = storeToRefs(dashboardVolunteersStore)

const props = defineProps({
  associationId: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(["update:modelValue", "onSave"])

const handleSave = async () => {
  if (!props.associationId) {
    toast.error("Aucune association sélectionnée")
    return
  }

  const formData = modalFormData.value

  if (isModalEdit.value) {
    // TODO: Update the news
    // await dashboardVolunteersStore.updateNews();
    // emit("onSave", { isEdit: true })
  }
  else {
    await dashboardVolunteersStore.createVolunteer({
      associationId: props.associationId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    })
    emit("onSave", { isEdit: false })
  }
  dashboardVolunteersStore.closeModal()
}
</script>

<style scoped lang="postcss">
.news-modal-content {
  @apply modal-box w-screen md:w-11/12 max-w-7xl flex flex-col gap-4 min-h-screen md:min-h-0 rounded-none md:rounded-lg;
}

.news-modal-title {
  @apply text-lg font-bold flex items-center gap-2;
}
</style>
