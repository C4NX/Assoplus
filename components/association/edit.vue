<template>
  <div v-if="isAssociationFetchedOrNotStarted">
    <div class="grid grid-cols-2 gap-4 my-4">
      <!-- Association Name -->
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Name</span>
        </div>
        <input v-model="associationForm.name" type="text" placeholder="Type here"
          class="input input-bordered input-primary w-full" :readonly="$props.readonly" :disabled="isLoading" />
      </label>
      <!-- Association Logo -->
      <label class="form-control w-full" v-if="!$props.readonly">
        <div class="label">
          <span class="label-text">Logo</span>
        </div>
        <input type="file" class="file-input file-input-primary file-input-bordered w-full" :readonly="$props.readonly" :disabled="isLoading"
          @change="(e) => {
          const target = e.target as HTMLInputElement | null;
          const file = target && target.files ? target.files[0] : null;
          if (file) {
            associationForm.logo = file
          }
        }">
      </label>
      <label class="form-control w-full" v-else>
        <div class="label">
          <span class="label-text">Logo</span>
        </div>
        <img :src="data.logoPathUrl" class="w-32 h-32 mt-2" />
      </label>
      <!-- Association Description -->
      <label class="form-control w-full col-span-2" :aria-readonly="$props.readonly">
        <div class="label">
          <span class="label-text">Description</span>
        </div>
        <textarea v-model="associationForm.description" class="textarea textarea-primary disabled"
          placeholder="Description" :readonly="$props.readonly" :disabled="isLoading" />
      </label>
      <!-- Association Tags -->
      <InputTagSelect v-model="associationForm.tags" :max-selected="8" class="col-span-2" :readonly="$props.readonly" :disabled="isLoading" />
    </div>

    <button class="btn btn-primary w-full" @click="() => associationId ? handleEdit() : handleCreate()" v-if="!$props.readonly"
      :disabled="isLoading">
      <Icon name="mdi:star-four-points" />
      {{ associationId ? "Editer" : "Créer" }} une association
    </button>
  </div>
</template>

<script lang="ts" setup>

import type { AssociationTag } from "~/shared/model"

interface AssociationForm {
  name: string
  description: string
  logo: File | null
  tags: AssociationTag[]
}

const props = defineProps({
  associationId: {
    type: String,
    required: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: "associationCreated", associationId: string): void
  (e: "associationEdited", associationId: string): void
}>()

const { status, data } = useFetch(() => `/api/association/${props.associationId}`, {
  immediate: !!props.associationId,
  lazy: !!props.associationId,
  transform: (data) => {
    if (data) {
      console.log("Association data", data)
      associationForm.value.name = data.name
      associationForm.value.description = data.description
      // associationForm.value.tags = data.tags
      associationForm.value.tags = [];
    }
    return data
  },
})

// When /api/association/:id is loaded or not started, the form is ready
const isAssociationFetchedOrNotStarted = computed(() => {
  return status.value === "success" || status.value === "idle"
})

const associationForm = ref<AssociationForm>({
  name: "",
  description: "",
  tags: [],
  logo: null,
})

const isLoading = ref(false)

const handleCreate = async () => {
  console.log("Creating association", associationForm.value)
  try {
    isLoading.value = true
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

    emit("associationCreated", result.id)
  } finally {
    isLoading.value = false
  }
}

const handleEdit = async () => {
  console.log("Editing association", associationForm.value)

  try {
    isLoading.value = true
    const associationId = props.associationId
    if (!associationId) {
      throw new Error("Association ID is required")
    }

    // Handle multipart/form-data (logo + JSON)
    const formData = new FormData()
    if (associationForm.value.logo) {
      formData.append("logo", associationForm.value.logo)
    }

    // Blobify JSON
    formData.append("data", new Blob([JSON.stringify({
      name: associationForm.value.name,
      description: associationForm.value.description,
      tags: associationForm.value.tags.map(tag => tag.id),
    })], { type: "application/json" }))

    const result = await $fetch(`/api/association/${associationId}`, {
      method: "PATCH",
      body: formData,
      onResponse: toastifyResponse,
    })

    emit("associationEdited", associationId)
  } finally {
    isLoading.value = false
  }
}

</script>

<style>

</style>