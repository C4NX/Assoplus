<template>
  <div class="bg-base-100 rounded-box py-4 px-6 space-y-4 shadow-sm border border-gray-200">
    <p class="flex items-center gap-2 justify-center text-md font-bold">
      <slot name="title">
        <Icon
          :name="icon"
          size="24"
        />
        {{ $t(title) }}
      </slot>
    </p>
    <div class="divider" />
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  icon: string
}>()
</script>

<style>

</style>
