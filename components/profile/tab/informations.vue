<template>
  <ProfileTabBase
    title="profile.informations"
    icon="mdi:account"
  >
    <form
      class="grid grid-cols-1 gap-2"
      @submit.prevent="handleSubmitUpdateInformations"
    >
      <div class="flex flex-col gap-2">
        <label for="email">Adresse email</label>
        <input
          id="email"
          v-model="informations.email"
          type="email"
          class="input"
        >
      </div>
      <div class="flex flex-col gap-2">
        <label for="firstname">Prénom</label>
        <input
          id="firstname"
          v-model="informations.firstname"
          type="text"
          class="input"
        >
      </div>
      <div class="flex flex-col gap-2">
        <label for="lastname">Nom</label>
        <input
          id="lastname"
          v-model="informations.lastname"
          type="text"
          class="input"
        >
      </div>
      <div class="flex flex-col gap-2">
        <label for="phone">Téléphone</label>
        <input
          id="phone"
          type="tel"
          class="input"
        >
      </div>
      <div class="flex flex-col gap-2">
        <label for="birthdate">Date de naissance</label>
        <input
          id="birthdate"
          type="date"
          class="input"
        >
      </div>
      <div class="flex justify-end">
        <button class="btn btn-primary text-neutral-content">
          <Icon
            name="mdi:content-save"
            size="24"
          />
          Enregistrer
        </button>
      </div>
    </form>
  </ProfileTabBase>
</template>

<script lang="ts" setup>
const informations = reactive({
  email: "",
  firstname: "",
  lastname: "",
  phone: "",
  birthdate: "",
})

const { user } = useUserSession()

watch(() => user, (newUser) => {
  informations.email = newUser.value?.email ?? ""
  informations.firstname = newUser.value?.firstName ?? ""
  informations.lastname = newUser.value?.lastName ?? ""
}, { immediate: true })

const handleSubmitUpdateInformations = async () => {
  console.log(informations)
}
</script>

<style>

</style>
