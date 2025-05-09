<template>
  <button
    class="btn"
    :disabled="props.disabled"
    @click="openModal"
  >
    <Icon
      name="mdi:file-export"
      class="w-5 h-5"
    />
    <slot name="title">
      {{ $t("export") }}  
    </slot>
  </button>
  <dialog
    ref="modal"
    class="modal modal-bottom sm:modal-middle"
  >
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        Exporter au format CSV
      </h3>
      <p class="py-4">
        Sélectionnez le délimiteur que vous souhaitez utiliser pour l'exportation au format CSV.
      </p>
      <label class="form-control">
        <span class="label-text">Délimiteur</span>
        <input
          v-model="delimiter"
          type="text"
          placeholder=";"
          class="input input-bordered w-full"
          maxlength="1"
        >
      </label>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">
            {{ $t("cancel") }}
          </button>
        </form>
        <button
          class="btn btn-primary"
          @click="handleExport"
        >
          <Icon
            name="mdi:file-export"
            class="w-5 h-5"
          />
          {{ $t("export") }}
        </button>
      </div>
    </div>
    <form
      method="dialog"
      class="modal-backdrop"
    >
      <button>close</button>
    </form>
  </dialog>
</template>

<script lang="ts" setup>
const props = defineProps<{
  csvUrl: string
  fileName: string
  disabled?: boolean
}>()

const delimiter = ref<string | null>(null)
const modal = ref<HTMLDialogElement | null>(null)
const { t } = useI18n()

const openModal = () => {
  if (modal.value) {
    delimiter.value = null
    modal.value.showModal()
  }
}

const closeModal = () => {
  if (modal.value) {
    modal.value.close()
  }
}

const handleExport = async () => {
  try {
    const blob = await $fetch<Blob>(props.csvUrl, {
      method: "GET",
      headers: {
        Accept: "text/csv",
      },
      query: {
        delimiter: delimiter.value ? delimiter.value : undefined,
      },
      retry: 0,
      responseType: "blob",
      onResponse: ctx => statusToastifyResponse(ctx, t), // Use only status code
    })

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = props.fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }
  finally {
    closeModal()
  }
}
</script>

<style>

</style>
