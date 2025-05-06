<template>
  <ProfileTabBase
    title="profile.security"
    icon="mdi:lock"
  >
    <ModalConfirm
      :cancelable="true"
      :dangerous="true"
      @confirm="async () => await accountStore.deleteAccount()"
      v-model="confirmDialogOpen"
      >
      <template #description>
        Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
      </template>
      <template #confirm>
        Supprimer
      </template>
    </ModalConfirm>

    <ProfileTabFormPassword v-if="!isOAuth2" />

    <p
      v-if="user?.googleId"
      class="text-bold text-secondary flex items-center justify-center gap-2"
    >
      Ce compte <b>Asso+</b> est lié à un compte
      <Icon name="logos:google-icon" /><b>Google</b>.
    </p>

    <div class="divider" />

    <div class="flex justify-end">
      <button
        class="btn btn-error text-neutral-content"
        @click="confirmDialogOpen = true"
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
const { user } = useUserSession()
const accountStore = useAccountStore()

const confirmDialogOpen = ref<boolean>(false)

const isOAuth2 = computed(() => {
  return user.value?.googleId !== null
})
</script>

<style>

</style>
