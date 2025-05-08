<template>
  <input v-model="isInviteModalOpen" type="checkbox" class="modal-toggle">
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="invite-modal-content">
      <h3 class="invite-modal-title">
        <Icon name="mdi:plus" />
        Inviter un utilisateur à devenir bénévole
      </h3>
      <div class="form-control w-full md:col-span-2">
        <label class="label">
          <span class="label-text">
            Email
          </span>
          <span class="label-text-alt text-error">*</span>
        </label>
        <input type="email" class="input input-bordered w-full" v-model="inviteModalEmail" placeholder="Email" />
      </div>
      <div class="modal-action">
        <button class="btn btn-primary" @click="handleInvite">
          Inviter
        </button>
        <button class="btn" @click="dashboardVolunteersStore.closeInviteModal()">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toast } from "vue3-toastify"

const dashboardVolunteersStore = useDashboardVolunteersStore()

const {
  isInviteModalOpen,
  inviteModalEmail,
} = storeToRefs(dashboardVolunteersStore)

const props = defineProps({
  associationId: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(["update:modelValue"])

const handleInvite = async () => {
  if (!props.associationId) {
    toast.error("Aucune association sélectionnée")
    return
  }

  await dashboardVolunteersStore.inviteVolunteer({
    associationId: props.associationId,
    email: inviteModalEmail.value,
  })
  dashboardVolunteersStore.closeInviteModal()
}
</script>

<style scoped lang="postcss">
.invite-modal-content {
  @apply modal-box w-screen md:w-11/12 max-w-7xl flex flex-col gap-4 min-h-screen md:min-h-0 rounded-none md:rounded-lg;
}

.invite-modal-title {
  @apply text-lg font-bold flex items-center gap-2;
}
</style>
