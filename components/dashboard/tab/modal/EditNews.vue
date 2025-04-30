<template>
  <!-- Using a legacy modal because of the MdEditor -->
  <input type="checkbox" class="modal-toggle" v-model="isModalOpen" />
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="news-modal-content">
      <h3 class="news-modal-title">
        <Icon name="mdi:pencil" v-if="isModalEdit" />
        <Icon name="mdi:plus" v-else />
        {{ isModalEdit ? 'Modifier' : 'Ajouter' }} une news
      </h3>
      <div class="flex gap-2">
        <input type="text" placeholder="Titre de la news" class="input input-bordered flex-1" v-model="modalFormData.title" />
        <select class="select select-bordered" v-model="modalFormData.status">
            <option value="DRAFT">📝 Brouillon</option>
            <option value="PUBLISHED">✅ Publié</option>
            <option value="ARCHIVED">📦 Archivé</option>
        </select>
      </div>
      <MdEditor v-model="modalFormData.content" language="fr-FR" :toolbars="[
          'bold',
          'underline',
          'italic',
          '-',
          'title',
          'strikeThrough',
          'sub',
          'sup',
          'quote',
          'unorderedList',
          'orderedList',
          'task',
          '-',
          'link',
          'image',
          'table',
          '-',
          'revoke',
          'next',
          '=',
          'preview',
          'previewOnly',
          'catalog',
        ]" />
      <div class="modal-action">
        <button class="btn btn-primary" @click="handleSave">Sauvegarder</button>
        <button class="btn" @click="dashboardNewsStore.closeModal()">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { config, MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import fr_FR from '@vavt/cm-extension/dist/locale/fr-FR';
import { toast } from 'vue3-toastify';

const dashboardNewsStore = useDashboardNewsStore();

const {
  isModalOpen,
  isModalEdit,
  modalFormData,
} = storeToRefs(dashboardNewsStore);

const props = defineProps({
  associationId: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(['update:modelValue', 'onSave']);

const handleSave = async () => {
  if(!props.associationId) {
    toast.error('Aucune association sélectionnée');
    return;
  }

  const formData = modalFormData.value;

  if (formData.content === '') {
    toast.error('Le contenu de la news ne peut pas être vide');
    return;
  }

  if(formData.title === '') {
    toast.error('Le titre de la news ne peut pas être vide');
    return;
  }

  if (isModalEdit.value) {
    //TODO: Update the news
    // await dashboardNewsStore.updateNews();
    emit('onSave', { isEdit: true });
  } else {
    await dashboardNewsStore.createNews(props.associationId, {
      title: formData.title,
      content: formData.content,
      status: formData.status,
    });
    emit('onSave', { isEdit: false });
  }
  dashboardNewsStore.closeModal();
}

config({
  editorConfig: {
    languageUserDefined: {
      'fr-FR': fr_FR, 
    },
  },
})

</script>

<style scoped lang="postcss">

.news-modal-content {
  @apply modal-box w-screen md:w-11/12 max-w-7xl flex flex-col gap-4 min-h-screen md:min-h-0 rounded-none md:rounded-lg;
}

.news-modal-title {
  @apply text-lg font-bold flex items-center gap-2;
}

</style>