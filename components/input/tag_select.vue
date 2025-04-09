<template>
  <div class="dropdown flex flex-row">
    <div>
      <button class="btn btn-primary border-r-0 rounded-r-none" tabindex="0">
        <Icon name="mdi:tag" />
        Tags
      </button>
      <ul
        class="dropdown-content menu menu-sm p-2 gap-2 shadow bg-base-100 rounded-box max-h-60 overflow-y-auto overflow-x-hidden flex-nowrap"
        tabindex="0">
        <li v-for="tag in data" :key="tag.id" @click="toggleTag(tag)">
          <a :class="{ 'active cursor-pointer': selectedTags.some(t => t.id === tag.id) }">
            <Icon name="mdi:tag" />
            {{ tag.name }}
          </a>
        </li>
      </ul>
    </div>
    <div class="input input-bordered flex items-center gap-2 p-1 flex-1 border-l-0 rounded-l-none">
      <div class="flex flex-wrap gap-2" v-if="selectedTags.length > 0">
        <div v-for="tag in selectedTags" :key="tag.id"
          class="badge badge-lg badge-outline badge-primary flex items-center justify-center gap-2 select-none">
          <span class="flex-1">{{ tag.name }}</span>
          <div class="cursor-pointer btn btn-xs btn-circle btn-ghost" @click.prevent="removeTag(tag)">
            <Icon name="mdi:close" />
          </div>
        </div>
      </div>
      <button v-if="selectedTags.length === 0" class="ml-2 text-gray-500 text-left w-full">
        {{ $t('association.tag_select.empty') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { toast } from "vue3-toastify";
import type { AssociationTag } from "~/shared/model";

const props = defineProps<{
  modelValue: AssociationTag[]
  maxSelected?: number
}>()
const { t } = useI18n()

const emit = defineEmits<{
  (e: 'update:modelValue', tags: AssociationTag[]): void
}>()

const { data } = await useFetch("/api/association/tags")

const selectedTags = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const toggleTag = (item: AssociationTag) => {
  const exists = selectedTags.value.some(t => t.id === item.id)
  if (exists) {
    selectedTags.value = selectedTags.value.filter(t => t.id !== item.id)
  } else {
    if (!props.maxSelected || selectedTags.value.length < props.maxSelected) {
      selectedTags.value = [...selectedTags.value, item]
    }else {
      toast.error(t('association.tag_select.max_selected', { max: props.maxSelected }))
    }
  }
}

const removeTag = (item: AssociationTag) => {
  selectedTags.value = selectedTags.value.filter(t => t.id !== item.id)
}
</script>