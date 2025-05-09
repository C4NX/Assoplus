<template>
  <UtilsLoading :status="status">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
      <!-- Association Name -->
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Nom de l'association</span>
        </div>
        <input
          v-model="associationForm.name"
          type="text"
          placeholder="Nom de l'association"
          class="input input-bordered w-full"
          :readonly="$props.readonly"
          :disabled="isLoading"
        >
      </label>

      <!-- Association Logo -->
      <label
        v-if="!$props.readonly"
        class="form-control w-full"
      >
        <div class="label">
          <span class="label-text">Logo</span>
        </div>
        <input
          type="file"
          class="file-input file-input-primary file-input-bordered w-full"
          :readonly="$props.readonly"
          :disabled="isLoading"
          @change="(e) => {
            const target = e.target as HTMLInputElement | null;
            const file = target && target.files ? target.files[0] : null;
            if (file) {
              associationForm.logo = file
            }
          }"
        >
      </label>

      <label
        v-else
        class="form-control w-full"
      >
        <div class="label">
          <span class="label-text">Logo</span>
        </div>
        <img
          v-if="data?.logoPathUrl"
          :src="data.logoPathUrl"
          class="w-full max-w-xs object-cover rounded"
        >
        <span
          v-else
          class="text-sm text-gray-500 text-center"
        >Aucune image</span>
      </label>

      <!-- Association Description -->
      <label class="form-control w-full sm:col-span-2">
        <div class="label">
          <span class="label-text">Description de votre association</span>
        </div>
        <textarea
          v-model="associationForm.description"
          class="textarea textarea-primary w-full"
          placeholder="Description"
          rows="4"
          :readonly="$props.readonly"
          :disabled="isLoading"
        />
      </label>

      <!-- Association Tags -->
      <InputTagSelect
        v-model="associationForm.tags"
        :max-selected="8"
        class="sm:col-span-2"
        :readonly="$props.readonly"
        :disabled="isLoading"
      />
    </div>

    <button
      v-if="!$props.readonly"
      class="btn btn-primary w-full mt-4"
      :disabled="isLoading"
      @click="associationId ? handleEdit() : handleCreate()"
    >
      <Icon name="mdi:star-four-points" />
      {{ associationId ? "Editer" : "Créer" }} une association
    </button>
  </UtilsLoading>
</template>

<script lang="ts" setup>
import type { Tag } from "~/shared/model"

interface AssociationForm {
  name: string
  description: string
  logo: File | null
  tags: Tag[]
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
  (e: "association-created" | "association-edited", associationId: string): void
}>()

const { status, data, refresh } = await useFetch(() => `/api/association/${props.associationId}`, {
  immediate: !!props.associationId,
  lazy: !!props.associationId,
  transform: (data) => {
    if (data) {
      associationForm.value.name = data.name
      associationForm.value.description = data.description
      // associationForm.value.tags = data.tags
      associationForm.value.tags = []
    }
    return data
  },
})

const associationForm = ref<AssociationForm>({
  name: "",
  description: "",
  tags: [],
  logo: null,
})

const isLoading = ref(false)

const handleCreate = async () => {
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

    emit("association-created", result.id)
  }
  finally {
    isLoading.value = false
  }
}

const handleEdit = async () => {
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

    await $fetch(`/api/association/${associationId}`, {
      method: "PATCH",
      body: formData,
      onResponse: toastifyResponse,
    })

    await refresh()
    emit("association-edited", associationId)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<style>

</style>
