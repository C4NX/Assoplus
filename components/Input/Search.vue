<template>
  <label :class="['input input-bordered flex-1 flex items-center gap-2', sizeClasses]">
    <Icon
      name="mdi:magnify"
      class="w-5 h-5"
    />
    <input
      v-model="searchInput"
      type="text"
      class="grow"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
    >
  </label>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  debounce: {
    type: Boolean,
    default: false,
  },
  debounceDelay: {
    type: Number,
    default: 300,
  },
  size: {
    type: String,
    default: "md",
    validate: (value: string) => ["xs", "sm", "md", "lg"].includes(value),
  },
})

const emit = defineEmits(["update:modelValue"])
const internalValue = ref(props.modelValue)
const debouncedValue = props.debounce
  ? useDebouncedSearch(internalValue, props.debounceDelay)
  : internalValue

watch(debouncedValue, (newValue) => {
  emit("update:modelValue", newValue)
})
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
})

const searchInput = computed({
  get: () => internalValue.value,
  set: (value) => {
    internalValue.value = value
  },
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case "xs":
      return "input-xs"
    case "sm":
      return "input-sm"
    case "lg":
      return "input-lg"
    case "md":
      return "input-md"
    default:
      return ""
  }
})
</script>
