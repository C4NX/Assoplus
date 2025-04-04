import type { FetchContext } from "ofetch"
import { toast } from "vue3-toastify"

interface ValidationErrorResponse {
  validation: string
  code: string
  message: string
  path: (string | number)[]
}

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
