<template>
  <DashboardTabBase>
    <template #title>
      <Icon name="mdi:star-four-points" />
      Create Association
    </template>
    <div class="grid grid-cols-2 gap-4 my-4">
      <!-- Association Name -->
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Name</span>
        </div>
        <input
          v-model="associationForm.name"
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full"
        >
      </label>
      <!-- Association Logo -->
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Logo</span>
        </div>
        <input
          type="file"
          class="file-input file-input-bordered w-full"
          @change="(e) => {
            const target = e.target as HTMLInputElement | null;
            const file = target && target.files ? target.files[0] : null;
            if (file) {
              associationForm.logo = file
            }
          }"
        >
      </label>
      <!-- Association Description -->
      <label class="form-control w-full col-span-2">
        <div class="label">
          <span class="label-text">Description</span>
        </div>
        <textarea
          v-model="associationForm.description"
          class="textarea textarea-primary"
          placeholder="Description"
        />
      </label>
      <!-- Association Tags -->
      <InputTagSelect
        v-model="associationForm.tags"
        :max-selected="8"
        class="col-span-2"
      />
    </div>

    <button
      class="btn btn-primary"
      @click="handleCreate"
    >
      <Icon name="mdi:star-four-points" />
      Create Association
    </button>
  </DashboardTabBase>
</template>

<script lang="ts" setup>
import type { AssociationTag } from "~/shared/model"

const dashboard = useDashboardStore()

interface AssociationForm {
  name: string
  description: string
  logo: File | null
  tags: AssociationTag[]
}

const associationForm = ref<AssociationForm>({
  name: "",
  description: "",
  tags: [],
  logo: null,
})

const handleCreate = async () => {
  console.log("Creating association", associationForm.value)
  const result = await $fetch("/api/association", {
    method: "POST",
    body: {
      name: associationForm.value.name,
      description: associationForm.value.description,
      tags: associationForm.value.tags.map(tag => tag.id),
      logo: associationForm.value.logo,
    },
    onResponse: toastifyResponse,
  })

  if (associationForm.value.logo) {
    const formData = new FormData()
    formData.append("file", associationForm.value.logo)
    await $fetch(`/api/association/${result.id}/logo`, {
      method: "POST",
      body: formData,
      onResponse: toastifyResponse,
    })
  }

  dashboard.needAssociationListRefresh = true
  dashboard.setTab(DashboardTabType.INFORMATIONS, result.id)
}
</script>

<style>

</style>
