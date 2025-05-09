<template>
  <input
    v-model="isModalOpen"
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
    <div class="news-modal-content">
      <h3 class="news-modal-title">
        <Icon
          v-if="isModalEdit"
          name="mdi:pencil"
        />
        <Icon
          v-else
          name="mdi:plus"
        />
        {{ isModalEdit ? 'Modifier' : 'Ajouter' }} une news
      </h3>
      <div class="flex gap-2">
        <input
          v-model="modalFormData.title"
          type="text"
          placeholder="Titre de la news"
          class="input input-bordered flex-1"
        >
        <select
          v-model="modalFormData.status"
          class="select select-bordered"
        >
          <option value="DRAFT">
            📝 Brouillon
          </option>
          <option value="PUBLISHED">
            ✅ Publié
          </option>
          <option value="ARCHIVED">
            📦 Archivé
          </option>
        </select>
      </div>
      <Editor
        v-model="modalFormData.content"
        tinymce-script-src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.6.1/tinymce.min.js"
        :init="{
          plugins: 'lists link image table code help wordcount',
          promotion: false,
          license_key: 'gpl',
        }"
      />
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
          @click="dashboardNewsStore.closeModal()"
        >
          Close
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import Editor from "@tinymce/tinymce-vue"
import { toast } from "vue3-toastify"

const dashboardNewsStore = useDashboardNewsStore()

const {
  isModalOpen,
  isModalEdit,
  modalFormData,
} = storeToRefs(dashboardNewsStore)

const props = defineProps({
  associationId: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(["update:modelValue", "onSave"])

const handleSubmit = async () => {
  if (!props.associationId) {
    toast.error("Aucune association sélectionnée")
    return
  }

  const formData = modalFormData.value

  if (formData.content === "") {
    toast.error("Le contenu de la news ne peut pas être vide")
    return
  }

  if (formData.title === "") {
    toast.error("Le titre de la news ne peut pas être vide")
    return
  }

  if (isModalEdit.value) {
    await dashboardNewsStore.updateNews({
      id: formData.id,
      title: formData.title,
      content: formData.content,
      status: formData.status,
    })
    emit("onSave", { isEdit: true })
  }
  else {
    await dashboardNewsStore.createNews({
      associationId: props.associationId,
      title: formData.title,
      content: formData.content,
      status: formData.status,
    })
    emit("onSave", { isEdit: false })
  }
  dashboardNewsStore.closeModal()
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
