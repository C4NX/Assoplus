<template>
  <footer class="bg-white dark:bg-gray-900">
    <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
      <div class="md:flex md:justify-between">
        <div class="mb-6 md:mb-0">
          <NuxtLink
            to="/"
            class="flex items-center"
          >
            <img
              src="/logo.svg"
              class="h-2 me-3"
              alt="FlowBite Logo"
            >
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Asso+</span>
          </NuxtLink>
        </div>
        <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
          <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Resources
            </h2>
            <ul class="text-gray-500 dark:text-gray-400 font-medium">
              <li class="mb-4">
                <NuxtLink
                  to="/"
                  class="hover:underline"
                >Asso+</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/"
                  class="hover:underline"
                >Tailwind CSS</NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Follow us
            </h2>
            <ul class="text-gray-500 dark:text-gray-400 font-medium">
              <li class="mb-4">
                <a
                  href="https://github.com/themesberg/flowbite"
                  class="hover:underline "
                >Github</a>
              </li>
              <li>
                <a
                  href="https://discord.gg/4eeurUVvTy"
                  class="hover:underline"
                >Discord</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Legal
            </h2>
            <ul class="text-gray-500 dark:text-gray-400 font-medium">
              <li class="mb-4">
                <a
                  href="#"
                  class="hover:underline"
                >Privacy Policy</a>
              </li>
              <li>
                <a
                  href="#"
                  class="hover:underline"
                >Terms &amp; Conditions</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8">
      <div class="sm:flex sm:items-center sm:justify-between">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© {{ copyrightYear }} <a
          href="https://flowbite.com/"
          class="hover:underline"
        >Alexis Udycz</a>. All Rights Reserved.
        </span>
        <div class="flex mt-4 sm:justify-center sm:mt-0">
          <a
            href="#"
            class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <Icon
              name="mdi:facebook"
              class="w-4 h-4"
            />
            <span class="sr-only">Facebook page</span>
          </a>
          <a
            href="#"
            class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
          >
            <Icon
              name="mdi:discord"
              class="w-4 h-4"
            />
            <span class="sr-only">Discord community</span>
          </a>
          <a
            href="#"
            class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
          >
            <Icon
              name="mdi:twitter"
              class="w-4 h-4"
            />
            <span class="sr-only">Twitter page</span>
          </a>
          <a
            href="#"
            class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
          >
            <Icon
              name="mdi:github"
              class="w-4 h-4"
            />
            <span class="sr-only">GitHub account</span>
          </a>
          <a
            href="#"
            class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
          >
            <Icon
              name="mdi:dribbble"
              class="w-4 h-4"
            />
            <span class="sr-only">Dribbble account</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const currentYear = new Date().getFullYear()
const copyrightYear = computed(() => {
  return currentYear === 2025 ? "2025" : `2025 - ${currentYear}`
})
</script>

<style></style>
