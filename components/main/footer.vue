<template>
  <footer class="footer bg-base-200 text-base-content p-10">
    <aside>
      <div class="flex items-center justify-center gap-2">
        <img src="/logo.svg" alt="logo" class="w-10">
        Asso+
      </div>
      <p>
        {{ copyrightYear }} &copy; All rights reserved
      </p>
    </aside>
    <nav>
      <h6 class="footer-title">
        {{ $t("footer.social") }}
      </h6>
      <a class="link link-hover">
        LinkedIn
      </a>
      <a class="link link-hover">
        Twitter (formerly X)
      </a>        
      <a class="link link-hover">
        BlueSky
      </a>
      <a class="link link-hover">
        Mastodon
      </a>
    </nav>
    <!-- <nav>
      <h6 class="footer-title">
        Company
      </h6>
      <a class="link link-hover">About us</a>
      <a class="link link-hover">Contact</a>
      <a class="link link-hover">Jobs</a>
      <a class="link link-hover">Press kit</a>
    </nav> -->
    <nav>
      <h6 class="footer-title">
        {{ $t("footer.legal") }}
      </h6>
      <NuxtLinkLocale class="link link-hover" to="/terms">
        {{ $t("footer.terms") }}
      </NuxtLinkLocale>
      <NuxtLinkLocale class="link link-hover" to="/privacy">
        {{ $t("footer.privacy") }}
      </NuxtLinkLocale>
    </nav>
  </footer>
</template>

<script lang="ts" setup>
const currentYear = new Date().getFullYear()
const copyrightYear = computed(() => {
  return currentYear === 2025 ? "2025" : `2025 - ${currentYear}`
})
</script>

<style>
</style>
