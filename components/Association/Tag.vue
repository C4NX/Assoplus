<template>
  <div :class="{ 'w-full': inline, 'badge': !inline }">
    <Icon :name="config.icon" class="w-4 h-4 mr-1" />
    <slot />
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  type: 'TYPE_CLASSIC' | 'TYPE_SPORT' | 'TYPE_CULTURE' | 'TYPE_ENVIRONMENT' | 'TYPE_SOCIAL' | 'TYPE_LGBT',
  inline?: boolean
}>()

const config = computed(() => {
  switch (props.type) {
    case 'TYPE_CLASSIC':
      return { icon: 'emojione:bookmark' }
    case 'TYPE_SPORT':
      return { icon: 'emojione:running-shirt' }
    case 'TYPE_CULTURE':
      return { icon: 'emojione:performing-arts' }
    case 'TYPE_ENVIRONMENT':
      return { icon: 'emojione:leaf-fluttering-in-wind' }
    case 'TYPE_SOCIAL':
      return { icon: 'emojione:busts-in-silhouette' }
    case 'TYPE_LGBT':
      return { icon: 'emojione:flag-for-rainbow-flag' }
    default:
      return { icon: 'emojione:bookmark' }
  }
})
</script>