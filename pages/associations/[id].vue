<template>
  <div class="min-h-screen pt-20 bg-base-200 flex flex-col">
    {{ data }}
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

const { data, error, status } = await useFetch(`/api/association/${route.params.id}`)

watch(error, () => {
  router.push("/associations")
  toast.error("Failed to fetch association", { delay: 1000 })
})
</script>

<style>

</style>
