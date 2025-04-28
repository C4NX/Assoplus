<template>
  <DashboardTabBase>
    <template #title>
      <Icon name="mdi:information-outline" />
      Informations
    </template>
    <!-- Delete Modal-->
    <dialog class="modal" ref="deleteModal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">
          Etes-vous sûr de vouloir supprimer cette association ?
        </h3>
        <p class="py-4">
          Cette action est irréversible et supprimera toutes les données associées à cette association.
        </p>
        <div class="modal-action">
          <button class="btn btn-error" @click="handleDelete">Supprimer</button>
          <button class="btn" @click="deleteModal?.close()">Annuler</button>
        </div>
      </div>
      <div class="modal-backdrop">
        <button @click="deleteModal?.close()">close</button>
      </div>
    </dialog>

    <div class="flex flex-col gap-4">
      <div class="flex justify-end gap-2">
        <button
          class="btn btn-primary text-base-100 tooltip tooltip-left"
          @click="dashboard.setTab(DashboardTabType.HOME)" data-tip="Retour au tableau de bord">
          <Icon name="mdi:arrow-left" />
        </button>
        <NuxtLinkLocale
          class="btn btn-secondary"
          :to="`/associations/${dashboard.activeAssociationId}`" 
          data-tip="Retour à la liste des associations">
          <Icon name="mdi:eye" />
          Voir la page de l'association
        </NuxtLinkLocale>
        <button :class="['btn', editMode ? 'btn-secondary' : 'btn-primary']" @click="editMode = !editMode">
          <Icon :name="editMode ? 'mdi:close' : 'mdi:pencil'" />
          {{ editMode ? "Arreter d'éditer" : "Editer" }}
        </button>
      </div>

      <AssociationEdit :associationId="dashboard.activeAssociationId" :readonly="!editMode" />

      <div class="flex justify-end">
        <!-- Delete button -->
        <button class="btn btn-error rounded-full text-base-100 tooltip tooltip-left before:text-nowrap before:max-w-96"
          @click="deleteModal?.show()" :data-tip="$t('association.delete.tooltip')">
          <Icon name="mdi:delete" size="20" />
        </button>
      </div>
    </div>
  </DashboardTabBase>
</template>

<script lang="ts" setup>
const dashboard = useDashboardStore()

const deleteModal = ref<HTMLDialogElement | null>(null)
const editMode = ref(false)

const handleDelete = async () => {
  await $fetch(`/api/association/${dashboard.activeAssociationId}`, {
    method: "DELETE",
    onResponse: toastifyResponse,
  })

  dashboard.needAssociationListRefresh = true
  dashboard.setTab(DashboardTabType.HOME)
}

</script>

<style></style>
