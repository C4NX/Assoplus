<template>
  <div class="min-h-screen p-5 pt-20 bg-grid flex flex-col gap-4">
    <div
      v-if="data"
      class="association-container"
    >
      <img
        v-if="data.logoPathUrl"
        :src="data.logoPathUrl"
        alt="Association Logo"
        class="w-32 h-32 rounded-md"
      >
      <div class="flex flex-col gap-2">
        <h2 class="text-2xl font-bold flex justify-between">
          {{ data.name }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ data.description }}
        </p>
        <div class="flex gap-2" />
      </div>
    </div>

    <div
      v-if="data"
      class="space-y-2"
    >
      <AssociationPanelNews :association-id="data.id" />
    </div>

    <div
      v-if="status === 'pending'"
      class="flex w-52 flex-col gap-4"
    >
      <div class="skeleton h-32 w-full" />
      <div class="skeleton h-4 w-28" />
      <div class="skeleton h-4 w-full" />
      <div class="skeleton h-4 w-full" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toast } from "vue3-toastify"

const route = useRoute()
const router = useRouter()

const { data, error, status } = await useFetch(`/api/association/${route.params.id}`, {
  cache: "reload",
})

watch(error, () => {
  router.push("/associations")
  toast.error("Failed to fetch association", { delay: 1000 })
})

useHead({
  title: data.value?.name,
  meta: [
    {
      name: "description",
      content: data.value?.description,
    },
  ],
})
</script>

<style lang="postcss" scoped>
.association-container {
  @apply bg-base-100 p-4 rounded-lg border border-base-200 shadow-md flex gap-2;
}
</style>
