<template>
  <label :class="['swap swap-rotate btn', size]">
    <input
      v-model="isAscending"
      type="checkbox"
    >
    <Icon
      name="mdi-sort-alphabetical-ascending"
      class="swap-on fill-current w-5 h-5"
    />
    <Icon
      name="mdi-sort-alphabetical-descending"
      class="swap-off fill-current w-5 h-5"
    />
  </label>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "asc",
    validator: (value: string) => ["asc", "desc"].includes(value),
  },
  size: {
    type: String,
    default: "md",
    validator: (value: string) => ["xs", "sm", "md", "lg"].includes(value),
  },
})

const emit = defineEmits<{
  (e: "update:modelValue", value: "asc" | "desc"): void
}>()

const isAscending = computed({
  get: () => props.modelValue === "asc",
  set: value => emit("update:modelValue", value ? "asc" : "desc"),
})

const size = computed(() => {
  switch (props.size) {
    case "xs":
      return "btn-xs"
    case "sm":
      return "btn-sm"
    case "md":
      return "btn-md"
    case "lg":
      return "btn-lg"
    default:
      return ""
  }
})
</script>

<style>

</style>
