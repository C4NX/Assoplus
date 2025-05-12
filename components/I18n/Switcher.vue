<template>
  <li
    v-if="inline"
  >
    <details>
      <summary>{{ $t("header.language_select") }}</summary>
      <ul class="p-2">
        <li
          v-for="locale in availableLocales"
          :key="locale"
        >
          <a
            :disabled="locale === currentLocale"
            @click="setLocaleAndSave(locale)"
          >
            {{ getLocaleName(locale) }}
          </a>
        </li>
      </ul>
    </details>
  </li>
  <div
    v-else
    :title="$t('header.language_select')"
    class="dropdown dropdown-end"
  >
    <div
      tabindex="0"
      role="button"
      class="btn btn-ghost"
      aria-label="Language"
    >
      <Icon
        name="mdi:translate"
        class="h-4 w-4"
      />
      <Icon
        name="mdi:chevron-down"
        class="hidden h-2 w-2 opacity-60 sm:inline-block"
      />
    </div>
    <div
      tabindex="0"
      class="dropdown-content bg-base-100 text-base-content rounded-box shadow-lg border border-base-300"
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

defineProps({
  inline: {
    type: Boolean,
    default: false,
  },
})

type AvailableLocales = typeof availableLocales[number]

const setLocaleAndSave = (locale: AvailableLocales) => {
  setLocale(locale)
  localStorage.setItem("locale", locale)
}

const getLocaleName = (locale: AvailableLocales) => {
  const localMessage = getLocaleMessage(locale)
  if (localMessage && "localeName" in localMessage) {
    return localMessage.localeName ?? locale
  }
  return locale
}
</script>
