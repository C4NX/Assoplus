<template>
  <aside
    id="logo-sidebar"
    class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
    aria-label="Sidebar"
  >
    <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <a
        href="https://flowbite.com/"
        class="flex items-center ps-2.5 mb-5"
      >
        <img
          src="https://flowbite.com/docs/images/logo.svg"
          class="h-6 me-3 sm:h-7"
          alt="Asso+ Logo"
        >
        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Asso+</span>
      </a>
      <ul class="space-y-2 font-medium">
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <Icon
              name="mdi:clock-outline"
              class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            />
            <span class="ms-3">Dashboard</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <Icon
              name="mdi:view-dashboard-outline"
              class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            />
            <span class="flex-1 ms-3 whitespace-nowrap">Kanban</span>
            <span
              class="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300"
            >Pro</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <Icon
              name="mdi:inbox-outline"
              class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            />
            <span class="flex-1 ms-3 whitespace-nowrap">Inbox</span>
            <span
              class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300"
            >3</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <Icon
              name="mdi:account-outline"
              class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            />
            <span class="flex-1 ms-3 whitespace-nowrap">Users</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <Icon
              name="mdi:shopping-outline"
              class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            />
            <span class="flex-1 ms-3 whitespace-nowrap">Products</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <Icon
              name="mdi:login"
              class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            />
            <span class="flex-1 ms-3 whitespace-nowrap">Sign In</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <Icon
              name="mdi:account-plus-outline"
              class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            />
            <span class="flex-1 ms-3 whitespace-nowrap">Sign Up</span>
          </a>
        </li>
      </ul>
      <div
        id="dropdown-cta"
        class="p-4 mt-6 rounded-lg bg-blue-50 dark:bg-blue-900"
        role="alert"
      >
        <div class="flex items-center mb-3">
          <span
            class="bg-orange-100 text-orange-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded-sm dark:bg-orange-200 dark:text-orange-900"
          >Beta</span>
          <button
            type="button"
            class="ms-auto -mx-1.5 -my-1.5 bg-blue-50 inline-flex justify-center items-center w-6 h-6 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
            data-dismiss-target="#dropdown-cta"
            aria-label="Close"
          >
            <span class="sr-only">Close</span>
            <Icon
              name="mdi:close"
              class="w-2.5 h-2.5"
            />
          </button>
        </div>
        <p class="mb-3 text-sm text-blue-800 dark:text-blue-400">
          We're currently in beta. If you have any feedback, please let us know.
        </p>
        <a
          class="text-sm text-blue-800 underline font-medium hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
          href="#"
        >Turn new navigation off</a>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
// import { initFlowbite } from 'flowbite';
// import { onMounted } from 'vue'
// import { useFlowbite } from '~/composables/useFlowbite';

// // initialize components based on data attribute selectors
// onMounted(() => {
//   useFlowbite(() => {
//     initFlowbite();
//   })
// })
</script>
