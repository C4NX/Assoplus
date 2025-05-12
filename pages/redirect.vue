<template>
  <div class="min-h-screen pt-20 bg-grid flex w-full items-center justify-center">
    <div class="card w-96 bg-base-100 shadow-xl p-10 text-center flex flex-col gap-4">
      <span class="text-xl font-bold">
        Attention! Vous avez été redirigé vers une page externe. Veuillez vérifier l'URL ci-dessous avant de continuer.
      </span>
      <a
        v-if="to"
        :href="to.toString()"
        rel="noopener noreferrer"
        class="link link-error break-words"
      >
        {{ to }}
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { query } = useRoute()

const to = computed(() => {
  try {
    return "to" in query ? new URL(decodeURIComponent(String(query.to))) : null
  }
  catch {
    return null
  }
})
</script>
