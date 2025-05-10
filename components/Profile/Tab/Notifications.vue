<template>
  <ProfileTabBase
    title="profile.notifications.title"
    icon="mdi:email"
  >
    <UtilsLoading :status="status">
      <div class="flex flex-col gap-4">
        <div
          v-for="(item, index) in data?.items"
          :key="index"
          class="card bg-base-100 w-full shadow-xl"
        >
          <div class="card-body">
            <h2 class="card-title">
              {{ $t("profile.notifications.invite_title", {name: item.association.name}) }}
            </h2>
            <p>
              {{ item.association.description }}
            </p>
            <p class="space-x-1">
              <span class="text-gray-500">Envoyé par :</span>
              <span class="text-gray-700 font-semibold">{{ item.createdBy?.firstName }} {{ item.createdBy?.lastName }}</span>
              <span class="text-gray-500">le</span>
              <span class="text-gray-700 font-semibold">{{ $d(new Date(item.createdAt), 'short') }}</span>
            </p>
            <div class="card-actions justify-end">
              <button
                class="btn"
                @click="handleRejectInvite(item.id)"
              >
                {{ $t("common.reject") }}
              </button>
              <button
                class="btn btn-primary"
                @click="handleAcceptInvite(item.id)"
              >
                {{ $t("common.accept") }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <p
        v-if="data?.total === 0"
        class="text-sm text-gray-400 text-center"
      >
        <span class="text-gray-700 font-semibold">
          {{ $t("profile.notifications.empty") }}
        </span>
        <br>
        {{ $t("profile.notifications.empty_description") }}
      </p>
    </UtilsLoading>
    <div class="flex justify-center">
      <InputPagination
        v-if="data?.totalPages"
        v-model="currentPage"
        :total-pages="data.totalPages"
      />
    </div>
  </ProfileTabBase>
</template>

<script lang="ts" setup>
const currentPage = ref(1)
const { data, status, refresh } = useFetch("/api/invite", {
  params: {
    page: currentPage,
  },
})

const associationStore = useAssociationsStore()

const handleAcceptInvite = async (inviteId: string) => {
  await associationStore.acceptInvite(inviteId)
  currentPage.value = 1
  await refresh({ dedupe: true })
}
const handleRejectInvite = async (inviteId: string) => {
  await associationStore.rejectInvite(inviteId)
  currentPage.value = 1
  await refresh({ dedupe: true })
}
</script>

<style>

</style>
