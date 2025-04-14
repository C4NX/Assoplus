import type { FetchContext } from "ofetch"
import { toast } from "vue3-toastify"

interface ValidationErrorResponse {
  validation: string
  code: string
  message: string
  path: (string | number)[]
}

/**
 * A toastify response function that shows a success or error message based on the response status.
 */
export function statusToastifyResponse(ctx: FetchContext, t: ReturnType<typeof useI18n>['t']) {
  if (ctx.response?.ok) {
    toast.success(t('toast.success'))
  }
  else {
    toast.error(t('toast.error'))
  }
}

/**
 * A toastify response function that shows a success or error message based on the response status.
 * It also handles ZodError validation errors and displays them in a user-friendly way.
 */
export function toastifyResponse(ctx: FetchContext) {
  const responseData = ctx.response?._data

  if (typeof responseData?.message === "string") {
    if (ctx.response?.ok) {
      toast.success(responseData.message)
    }
    else {
      if (responseData?.data?.name === "ZodError") {
        const zodErrors = responseData.data.issues as ValidationErrorResponse[]
        zodErrors.forEach((error: ValidationErrorResponse) => {
          if (Array.isArray(error.path) && error.path.length > 0 && error.message) {
            toast.error(`${error.path.join(", ")}: ${error.message}`)
          }
          else {
            toast.error(error.message ?? "An error occurred")
          }
        })
      }
      else {
        toast.error(responseData.message)
      }
    }
  }
}
