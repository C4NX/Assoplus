import type { H3Event } from "h3"

export function throwIfNotAuthenticated(event: H3Event) {
  if (!event.context.auth) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }
}

export function throwIfNotGranted(event: H3Event, permission: string) {
  if (!event.context.auth?.user.roles.includes(permission)) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" })
  }
}
