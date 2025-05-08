<template>
  <div class="dropdown flex flex-row">
    <div>
      <!-- Tags left button -->
      <button :class="['btn border-r-0 rounded-r-none', readonlyOrDisabled ? 'btn-disabled' : 'btn-primary']"
        tabindex="0" :disabled="readonlyOrDisabled">
        <Icon name="mdi:tag" />
        Tags
      </button>
      <!-- Tags dropdown -->
      <ul
        :class="['dropdown-content menu menu-sm p-2 gap-2 shadow bg-base-100 rounded-box max-h-60 overflow-y-auto overflow-x-hidden flex-nowrap', readonlyOrDisabled ? 'hidden' : 'block']"
        :tabindex="(readonlyOrDisabled) ? undefined : 0">
        <UtilsLoading :status="status">
          <li v-for="tag in data" :key="tag.id" :class="[readonlyOrDisabled ? 'disabled' : 'cursor-pointer']"
            @click="toggleTag(tag)">
            <AssociationTag :type="tag.type" :class="[selectedTags.some(t => t.id === tag.id) ? 'active cursor-pointer' : 'cursor-pointer']" inline v-if="tag">
              {{ tag.name }}
            </AssociationTag>
          </li>
        </UtilsLoading>
      </ul>
    </div>
    <!-- Selected tags input -->
    <div class="input input-bordered flex items-center gap-2 p-1 flex-1 border-l-0 rounded-l-none">
      <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2">
        <div v-for="tag in selectedTags" :key="tag.id"
          :class="['badge badge-lg badge-primary badge-outline flex items-center justify-center gap-2 select-none', (readonlyOrDisabled) ? '!badge-ghost !text-opacity-55' : '']">
          <AssociationTag :type="tag.type" inline v-if="tag">
              {{ tag.name }}
              <div
                :class="['cursor-pointer btn btn-xs btn-circle btn-ghost', (readonlyOrDisabled) ? 'pointer-events-none' : '']"
                @click.prevent="removeTag(tag)">
                <Icon name="mdi:close" />
              </div>
          </AssociationTag>
        </div>
      </div>
      <!-- Empty state -->
      <button v-if="selectedTags.length === 0" class="ml-2 text-gray-500 text-left w-full">
        {{ $t('association.tag_select.empty') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AssociationTag } from "#components";
import { computed } from "vue"
import { toast } from "vue3-toastify"
import type { Tag } from "~/shared/model"

const props = defineProps<{
  modelValue: Tag[]
  maxSelected?: number
  disabled?: boolean
  readonly?: boolean
}>()
const { t } = useI18n()

const readonlyOrDisabled = computed(() => props.readonly || props.disabled)

const emit = defineEmits<{
  (e: "update:modelValue", tags: Tag[]): void
}>()

const { data, status } = useFetch("/api/association/tags")

const selectedTags = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value),
})

const toggleTag = (item: Tag) => {
  const exists = selectedTags.value.some(t => t.id === item.id)
  if (exists) {
    selectedTags.value = selectedTags.value.filter(t => t.id !== item.id)
  }
  else {
    if (!props.maxSelected || selectedTags.value.length < props.maxSelected) {
      selectedTags.value = [...selectedTags.value, item]
    }
    else {
      toast.error(t("association.tag_select.max_selected", { max: props.maxSelected }))
    }
  }
}

const removeTag = (item: Tag) => {
  selectedTags.value = selectedTags.value.filter(t => t.id !== item.id)
}
</script>
