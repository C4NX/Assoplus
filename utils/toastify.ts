import type { FetchContext } from "ofetch"
import { toast } from "vue3-toastify"

/**
 * A toastify response function that shows a success or error message based on the response status.
 */
export function statusToastifyResponse(ctx: FetchContext, t: ReturnType<typeof useI18n>["t"]) {
  if (ctx.response?.ok) {
    toast.success(t("toast.success"))
  }
  else {
    toast.error(t("toast.error"))
  }
}

/**
 * A toastify response function that shows a success or error message based on the response status.
 * It also handles ZodError validation errors and displays them in a user-friendly way.
 */
export function toastifyResponse(ctx: FetchContext) {
  const responseData = ctx.response?._data
  if (ctx.response?.ok && typeof responseData?.message === "string") {
    toast.success(responseData.message)
    return
  }
  else if (!ctx.response?.ok) {
    // handle ZodError with formErrors
    if (ctx.response?.status === 422 && typeof responseData?.data?.fieldErrors === "object") {
      const fieldErrors = responseData.data.fieldErrors as Record<string, string[]>
      const errorEntries = Object.entries(fieldErrors)
      const hasMoreErrors = errorEntries.length > 3
      const errorMessages = errorEntries
        .slice(0, 2)
        .map(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            return `${key}: ${value.join(", ")}`
          }
          return `${key}: ${value[0] ?? "An error occurred"}`
        })
        .join("\n")

      const finalErrorMessage = hasMoreErrors
        ? `${errorMessages}\n...`
        : errorMessages
      toast.error(finalErrorMessage)
      return
    }

    // Handle error cases
    if (typeof responseData?.message === "string") {
      toast.error(responseData.message)
      return
    }

    // Fallback error message
    toast.error("An unexpected error occurred")
  }
}
