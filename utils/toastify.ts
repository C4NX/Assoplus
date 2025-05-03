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
  console.log("ctx", ctx)
  if (ctx.error === undefined && typeof responseData?.message === "string") {
    toast.success(responseData.message)
    return
  }
  // Handle only 422 and 500 errors
  else if (ctx.error !== undefined || ctx.response?.status === 422 || ctx.response?.status === 500) {
    // handle ZodError with formErrors

    if (ctx.response?.status === 422 && typeof responseData?.data?.fieldErrors === "object") {
      const fieldErrors = responseData.data.fieldErrors as Record<string, string[]>

      Object.entries(fieldErrors).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          toast.error(`${key}: ${value.join(", ")}`)
        }
        else {
          toast.error(value[0] ?? "An error occurred")
        }
      })

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
