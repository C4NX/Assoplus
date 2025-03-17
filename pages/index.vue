<template>
  <div
    class="hero min-h-screen bg-[url('/images/background.webp')]"
  >
    <div class="hero-overlay bg-opacity-60 backdrop-blur-lg">
      <div class="hero-content text-neutral-content text-center min-h-screen max-w-none">
        <div class="max-w-lg">
          <h1 class="text-5xl font-bold flex flex-col justify-center items-center gap-2">
            <img
              src="/logo.svg"
              alt="Asso+"
              class="w-32 ml-4 inline-block"
            >
            Bienvenue sur Asso+
          </h1>
          <p class="text-lg my-4">
            La plateforme de gestion associative qui vous simplifie la vie.<br>
            Créez, gérez et animez votre association en toute simplicité avec un outil gratuit et facile à prendre en main.
            <span class="block mt-2">
              Rejoignez les <strong>{{ data.associations }}</strong> associations déjà inscrites sur Asso+.
            </span>
          </p>
          <div class="flex gap-2 justify-center md:flex-row flex-col">
            <NuxtLinkLocale
              class="btn btn-primary"
              to="/associations"
            >
              Rechercher une association
            </NuxtLinkLocale>
            <button class="btn btn-primary">
              Ajouter votre association
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = useFetch("/api/stats", { default: () => ({ associations: 0 }) })
</script>
