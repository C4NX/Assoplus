<template>
  <footer class="footer bg-base-200 text-base-content p-10">
    <aside>
      <div class="flex items-center justify-center gap-2">
        <img
          src="/logo.svg"
          alt="logo"
          class="w-10"
        >
        Asso+
      </div>
      <p>
        {{ copyrightYear }} &copy; All rights reserved
      </p>
    </aside>
    <nav>
      <h6 class="footer-title">
        Services
      </h6>
      <a class="link link-hover">Branding</a>
      <a class="link link-hover">Design</a>
      <a class="link link-hover">Marketing</a>
      <a class="link link-hover">Advertisement</a>
    </nav>
    <nav>
      <h6 class="footer-title">
        Company
      </h6>
      <a class="link link-hover">About us</a>
      <a class="link link-hover">Contact</a>
      <a class="link link-hover">Jobs</a>
      <a class="link link-hover">Press kit</a>
    </nav>
    <nav>
      <h6 class="footer-title">
        {{ $t("footer.legal") }}
      </h6>
      <NuxtLink
        class="link link-hover"
        to="/terms"
      >{{ $t("footer.terms") }}</NuxtLink>
      <NuxtLink
        class="link link-hover"
        to="/privacy"
      >{{ $t("footer.privacy") }}</NuxtLink>
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
