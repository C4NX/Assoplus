import type { FetchContext } from "ofetch"

/**
 * ofetch that supports authentication.
 */
export const useAppFetch = () => {
  return $fetch.create({
    headers: {
      "Content-Type": "application/json",
    },
    onRequest: authOnRequest,
    onResponseError: authOnResponseError,
  })
}

function authOnRequest({ options }: FetchContext) {
  const { token } = useAuthStore()

  if (token) { // inject token into headers
    options.headers = new Headers(options.headers)
    options.headers.set("Authorization", `Bearer ${token}`)
  }
}

async function authOnResponseError(context: FetchContext) {
  if (context.response?.status === 401) {
    const { refreshToken, refresh } = useAuthStore()
    if (refreshToken) {
      const newToken = await refresh()
      if (refreshToken && newToken) {
        // retry the request with the new token
        context.options.retry = 1
        context.options.retryStatusCodes = [401]
      }
    }
  }
}
