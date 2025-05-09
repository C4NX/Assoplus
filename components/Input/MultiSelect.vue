<template>
  <div :class="['dropdown w-full', $props.class || '']">
    <label
      tabindex="0"
      :class="[
        'input input-bordered w-full flex justify-between items-center cursor-pointer',
        sizeClass,
      ]"
    >
      <span
        v-if="selectedOptions.length === 0"
        class="opacity-50"
      >Select...</span>
      <span
        v-else
        class="truncate"
      >
        {{ selectedLabels.join(', ') }}
      </span>
      <Icon
        name="mdi:chevron-down"
        class="transition-transform duration-200"
      />
    </label>

    <!-- Dropdown Content -->
    <ul
      tabindex="0"
      :class="[
        'dropdown-content menu bg-base-100 rounded-box z-[1] w-full shadow',
        size === 'xs' ? 'p-1' : 'p-2',
      ]"
    >
      <li
        v-for="option in options"
        :key="option.value"
        class="hover:bg-base-200 rounded"
      >
        <label class="label cursor-pointer flex justify-between items-center">
          <span class="label-text">{{ option.label }}</span>
          <input
            type="checkbox"
            class="checkbox checkbox-xs"
            :checked="isSelected(option)"
            @change="toggleOption(option)"
          >
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Array,
    required: true,
  },
  size: {
    type: String,
    default: "md",
    validator: value => ["lg", "md", "sm", "xs"].includes(value),
  },
  class: {
    type: String,
    default: "",
  },
})

const emit = defineEmits(["update:modelValue"])

const selectedOptions = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value),
})

const sizeClass = computed(() => {
  switch (props.size) {
    case "lg": return "input-lg"
    case "sm": return "input-sm"
    case "xs": return "input-xs"
    default: return "input-md"
  }
})

const selectedLabels = computed(() =>
  selectedOptions.value.map(opt => opt.label),
)

const isSelected = option =>
  selectedOptions.value.some(o => o.value === option.value)

const toggleOption = (option) => {
  const exists = isSelected(option)
  if (exists) {
    selectedOptions.value = selectedOptions.value.filter(
      o => o.value !== option.value,
    )
  }
  else {
    selectedOptions.value = [...selectedOptions.value, { ...option }]
  }
}
</script>
