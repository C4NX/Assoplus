import type { H3Event } from "h3"

export function throwIfNotAuthenticated(event: H3Event) {
  if (!event.context.auth) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }
}
