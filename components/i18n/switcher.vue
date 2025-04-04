<template>
  <div
    title="Change Language"
    class="dropdown dropdown-end"
  >
    <div
      tabindex="0"
      role="button"
      class="btn btn-ghost"
      aria-label="Language"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="h-4 w-4"
      >
        <path
          fill-rule="evenodd"
          d="M11 5a.75.75 0 0 1 .688.452l3.25 7.5a.75.75 0 1 1-1.376.596L12.89 12H9.109l-.67 1.548a.75.75 0 1 1-1.377-.596l3.25-7.5A.75.75 0 0 1 11 5Zm-1.24 5.5h2.48L11 7.636 9.76 10.5ZM5 1a.75.75 0 0 1 .75.75v1.261a25.27 25.27 0 0 1 2.598.211.75.75 0 1 1-.2 1.487c-.22-.03-.44-.056-.662-.08A12.939 12.939 0 0 1 5.92 8.058c.237.304.488.595.752.873a.75.75 0 0 1-1.086 1.035A13.075 13.075 0 0 1 5 9.307a13.068 13.068 0 0 1-2.841 2.546.75.75 0 0 1-.827-1.252A11.566 11.566 0 0 0 4.08 8.057a12.991 12.991 0 0 1-.554-.938.75.75 0 1 1 1.323-.707c.049.09.099.181.15.271.388-.68.708-1.405.952-2.164a23.941 23.941 0 0 0-4.1.19.75.75 0 0 1-.2-1.487c.853-.114 1.72-.185 2.598-.211V1.75A.75.75 0 0 1 5 1Z"
          clip-rule="evenodd"
        />
      </svg> <svg
        width="12px"
        height="12px"
        class="hidden h-2 w-2 fill-current opacity-60 sm:inline-block"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2048 2048"
      >
        <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
      </svg>
    </div>
    <div
      tabindex="0"
      class="dropdown-content bg-base-200 text-base-content rounded-box "
    >
      <ul class="menu menu-sm gap-1">
        <li
          v-for="locale in availableLocales"
          :key="locale"
          @click="setLocaleAndSave(locale)"
        >
          <button :disabled="locale === currentLocale">
            <span class="badge badge-sm badge-outline px-2 py-1 text-xs font-semibold rounded-full">
              {{ locale }}
            </span>
            <span>{{ getLocaleName(locale) }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { locale: currentLocale, setLocale, availableLocales, getLocaleMessage } = useI18n()

const setLocaleAndSave = (locale: string) => {
  setLocale(locale)
  localStorage.setItem("locale", locale)
}

const getLocaleName = (locale: string) => {
  const localMessage = getLocaleMessage(locale)
  if (localMessage && "localeName" in localMessage) {
    return localMessage.localeName ?? locale
  }
  return locale
}
</script>
