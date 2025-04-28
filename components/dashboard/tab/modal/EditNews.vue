<template>
  <!-- Using a legacy modal because of the MdEditor -->
  <input type="checkbox" class="modal-toggle" v-model="isOpen"/>
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="news-modal-content">
      <h3 class="news-modal-title">
        <Icon name="mdi:pencil" v-if="edit" />
        <Icon name="mdi:plus" v-else />
        {{ edit ? 'Modifier' : 'Ajouter' }} une news
      </h3>
      <div class="flex gap-2">
        <input type="text" placeholder="Titre de la news" class="input input-bordered flex-1" v-model="formData.title" />
        <select class="select select-bordered" v-model="formData.status">
            <option value="DRAFT">📝 Brouillon</option>
            <option value="PUBLISHED">✅ Publié</option>
            <option value="ARCHIVED">📦 Archivé</option>
        </select>
      </div>
      <MdEditor v-model="formData.content" language="fr-FR" :toolbars="[
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
        <button class="btn" @click="handleClose">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { config, MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import fr_FR from '@vavt/cm-extension/dist/locale/fr-FR';
import { toast } from 'vue3-toastify';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  associationId: {
    type: String,
    required: false,
  },
  edit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'onSave']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const newsStore = useNewsStore();
const formData = reactive({
  title: '',
  content: '',
  status: 'draft',
})

const handleSave = async () => {
  if(!props.associationId) {
    toast.error('Aucune association sélectionnée');
    return;
  }

  if (formData.content === '') {
    toast.error('Le contenu de la news ne peut pas être vide');
    return;
  }

  if(formData.title === '') {
    toast.error('Le titre de la news ne peut pas être vide');
    return;
  }

  if (props.edit) {
    await newsStore.updateNews();
    emit('onSave', { isEdit: true });
  } else {
    await newsStore.createNews(props.associationId, {
      title: formData.title,
      content: formData.content,
      status: formData.status,
    });
    emit('onSave', { isEdit: false });
  }
  handleClose();
}

const handleClose = () => {
  formData.content = '';
  formData.title = '';
  formData.status = 'draft';
  isOpen.value = false;
};

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