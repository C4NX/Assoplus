import type { H3Event } from "h3"
import type { Role } from "./role.enum"
import type { PublicUserInterface } from "~/shared/auth"

export async function requireUserAuthenticated(event: H3Event) {
  const { user } = await requireUserSession(event)
  return user as PublicUserInterface
}

export async function requireUserGranted(event: H3Event, permissions: Role | Role[]) {
  const userSession = await requireUserSession(event)
  const userRoles = (userSession.user as PublicUserInterface)?.roles || []

  const hasPermission = Array.isArray(permissions)
    ? permissions.some(permission => userRoles.includes(permission))
    : userRoles.includes(permissions)

  if (!hasPermission) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" })
  }

  return userSession.user as PublicUserInterface
}
