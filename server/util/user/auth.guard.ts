import type { H3Event } from "h3"
import type { User } from "@prisma/client"
import type { Role } from "./role.enum"
import type { PublicUserInterface } from "~/shared/auth"
import prisma from "~/lib/prisma"

export async function requireUserAuthenticated(event: H3Event): Promise<User> {
  const { user } = await requireUserSession(event) as { user?: PublicUserInterface }

  if (!user || !user.id || typeof user.id !== "string") {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }

  const databaseUser = await prisma.user.findUnique({
    where: { id: user.id },
  })

  if (!databaseUser) {
    await clearUserSession(event)
    throw createError({ statusCode: 401, statusMessage: "Invalid session" })
  }

  return databaseUser
}

export async function requireUserGranted(event: H3Event, permissions: Role | Role[]) {
  const user = await requireUserAuthenticated(event)
  const userRoles = user?.roles || []

  const hasPermission = Array.isArray(permissions)
    ? permissions.some(permission => userRoles.includes(permission))
    : userRoles.includes(permissions)

  if (!hasPermission) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" })
  }

  return user
}

export async function requireAssociationOwner(event: H3Event, associationId: number) {
  const user = await requireUserAuthenticated(event)

  const association = await prisma.association.findUnique({
    where: { id: associationId },
    include: {
      owner: true,
    },
  })

  if (!association) {
    throw createError({ statusCode: 404, statusMessage: "Association not found" })
  }

  if (association.owner.id !== user.id) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" })
  }

  return user
}
