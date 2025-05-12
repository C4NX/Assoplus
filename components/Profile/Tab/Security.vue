<template>
  <ProfileTabBase
    title="profile.security.title"
    icon="mdi:lock"
  >
    <ModalConfirm
      v-model="confirmDialogOpen"
      :cancelable="true"
      :dangerous="true"
      @confirm="async () => await accountStore.deleteAccount()"
    >
      <template #description>
        {{ $t("profile.security.delete_account_warning") }}
      </template>
      <template #confirm>
        {{ $t("common.delete") }}
      </template>
    </ModalConfirm>

    <ProfileTabFormPassword v-if="!isOAuth2" />

    <p
      v-if="user?.googleId"
      class="text-bold text-secondary flex items-center justify-center gap-2"
    >
      {{ $t("profile.security.linked_to") }}
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
        {{ $t("profile.security.delete_account") }}
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
