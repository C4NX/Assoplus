<template>
  <div class="hero min-h-screen bg-rainbow">
    <div class="hero-overlay bg-opacity-60 backdrop-blur-lg">
      <div class="hero-content text-neutral-content text-center min-h-screen max-w-none">
        <div class="max-w-lg">
          <h1 class="text-5xl font-bold flex flex-col justify-center items-center gap-2">
            <img
              src="/logo.svg"
              alt="Asso+"
              class="w-32 ml-4 inline-block"
            >
            {{ $t("home.title") }}
          </h1>
          <p class="text-lg my-4">
            {{ $t("home.description1_1") }}
            <br>
            {{ $t("home.description1_2") }}
            <span class="block mt-2">
              {{ $t("home.description2_1") }}
              <strong>{{ data.users }}</strong>
              {{ $t("home.description2_2") }}
              <strong>{{ data.associations }}</strong>
              {{ $t("home.description2_3") }}
            </span>
          </p>
          <div class="flex gap-2 justify-center md:flex-row flex-col">
            <NuxtLinkLocale
              class="btn btn-primary"
              to="/associations"
            >
              <Icon
                name="mdi:magnify"
                class="hidden sm:inline"
              />
              {{ $t("home.explore") }}
            </NuxtLinkLocale>
            <NuxtLinkLocale
              class="btn btn-primary"
              to="/login"
            >
              <Icon
                name="mdi:account"
                class="hidden sm:inline"
              />
              {{ $t("home.register") }}
            </NuxtLinkLocale>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = useFetch("/api/stats", { default: () => ({ associations: 0, users: 0 }) })

definePageMeta({
  title: "Home",
})
</script>
