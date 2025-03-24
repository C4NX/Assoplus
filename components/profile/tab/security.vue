<template>
  <ProfileTabBase
    title="profile.security"
    icon="mdi:lock"
  >
    <dialog
      ref="deleteAccountDialog"
      class="modal"
    >
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 class="text-lg font-bold">
          Suppression du compte
        </h3>
        <p class="py-4">
          Êtes-vous sûr de vouloir supprimer votre compte ? <br> (Cette action est irréversible)
        </p>
        <div class="flex gap-5 justify-end">
          <form method="dialog">
            <button class="btn btn-primary text-neutral-content">
              Annuler
            </button>
          </form>
          <button
            class="btn btn-error text-neutral-content"
            @click="handleDeleteAccount"
          >
            Supprimer
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

    <ProfileTabFormPassword v-if="!user?.discordId" />

    <p
      v-if="user?.discordId"
      class="text-bold text-secondary flex items-center justify-center gap-2"
    >
      Ce compte <b>Asso+</b> est lié à un compte
      <Icon name="mdi:discord" /><b>Discord</b>.
    </p>
    <div class="flex justify-end">
      <button
        class="btn btn-error text-neutral-content"
        @click="deleteAccountDialog?.showModal()"
      >
        <Icon
          name="mdi:alert"
          size="24"
        />
        Supprimer mon compte
      </button>
    </div>
  </ProfileTabBase>
</template>

<script lang="ts" setup>
const { user, clear } = useUserSession()
const accountStore = useAccountStore()
const router = useRouter()

const deleteAccountDialog = ref<HTMLDialogElement | null>(null)

const handleDeleteAccount = async () => {
  deleteAccountDialog.value?.close()
  await accountStore.deleteAccount()
  await clear()
  await router.push("/")
}
</script>

<style>

</style>
