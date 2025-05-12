export function useDebouncedSearch<T>(input: Ref<T>, delay: number = 300) {
  let timeout: NodeJS.Timeout | null = null

  const debouncedSearchValue = ref<T>(input.value)

  watch(input, () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      if (input.value === "") {
        debouncedSearchValue.value = undefined
      }
      else {
        debouncedSearchValue.value = input.value
      }
    }, delay)
  })

  onBeforeUnmount(() => {
    if (timeout) {
      clearTimeout(timeout)
    }
  })

  return debouncedSearchValue
}
