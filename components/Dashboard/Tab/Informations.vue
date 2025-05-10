<template>
  <DashboardTabBase>
    <template #title>
      <Icon name="mdi:information-outline" />
      {{ $t("dashboard.association.title") }}
    </template>
    <!-- Delete Modal -->
    <dialog
      ref="deleteModal"
      class="modal"
    >
      <div class="modal-box">
        <h3 class="text-lg font-bold">
          {{ $t("dashboard.association.delete.title") }}
        </h3>
        <p class="py-4">
          {{ $t("dashboard.association.delete.description") }}
        </p>
        <div class="modal-action">
          <button
            class="btn btn-error"
            @click="handleDelete"
          >
            {{ $t("common.confirm") }}
          </button>
          <button
            class="btn"
            @click="deleteModal?.close()"
          >
            {{ $t("common.cancel") }}
          </button>
        </div>
      </div>
      <div class="modal-backdrop">
        <button @click="deleteModal?.close()">
          close
        </button>
      </div>
    </dialog>

    <div class="flex flex-col gap-4">
      <div class="flex justify-end gap-2">
        <button
          class="btn"
          @click="dashboard.setTab(DashboardTabType.HOME)"
        >
          <Icon name="mdi:arrow-left" />
        </button>
        <NuxtLinkLocale
          class="btn btn-primary"
          :to="`/associations/${dashboard.activeAssociationId}`"
          data-tip="Retour à la liste des associations"
        >
          <Icon name="mdi:eye" />
          {{ $t("dashboard.association.view") }}
        </NuxtLinkLocale>
        <button
          :class="['btn', editMode ? '' : 'btn-primary']"
          @click="editMode = !editMode"
        >
          <Icon :name="editMode ? 'mdi:close' : 'mdi:pencil'" />
          {{ $t(editMode ? "common.cancel" : "common.edit") }}
        </button>
      </div>

      <AssociationForm
        :association-id="dashboard.activeAssociationId"
        :readonly="!editMode"
        @association-edited="() => {
          editMode = false
        }"
      />

      <div class="flex justify-end">
        <!-- Delete button -->
        <button
          class="btn btn-error rounded-full text-base-100"
          @click="deleteModal?.show()"
        >
          <div class="flex items-center gap-2">
            <Icon
            name="mdi:delete"
            size="20"
          />
          {{ $t("dashboard.association.delete.button") }}
          </div>
        </button>
      </div>
    </div>
  </DashboardTabBase>
</template>

<script lang="ts" setup>
const dashboard = useDashboardStore()
const associationStore = useAssociationsStore()

const deleteModal = ref<HTMLDialogElement | null>(null)
const editMode = ref(false)

const handleDelete = async () => {
  if (!dashboard.activeAssociationId) {
    deleteModal.value?.close()
    return
  }

  await associationStore.delete(dashboard.activeAssociationId)
  dashboard.needAssociationListRefresh = true
  dashboard.setTab(DashboardTabType.HOME)
}
</script>

<style></style>
