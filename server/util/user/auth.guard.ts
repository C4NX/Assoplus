import type { H3Event } from "h3"
import type { User } from "@prisma/client"
import { AssociationRole } from "@prisma/client"
import { Role } from "./role.enum"
import type { PublicUserInterface } from "~/shared/auth"
import prisma from "~/lib/prisma"

export function createUnauthorized() {
  return createError({ statusCode: 401, statusMessage: "Unauthorized" })
}

export function createForbidden() {
  return createError({ statusCode: 403, statusMessage: "Forbidden" })
}

export function createInvalidSession() {
  return createError({ statusCode: 401, statusMessage: "Invalid session" })
}

export async function tryGetAuthenticatedUser(event: H3Event): Promise<User | null> {
  let user = null

  try {
    const { user: sessionUser } = await requireUserSession(event) as { user?: PublicUserInterface }
    user = sessionUser
  }
  catch {
    return null
  }

  if (!user || !user.id || typeof user.id !== "string") {
    return null
  }

  const databaseUser = await prisma.user.findUnique({
    where: { id: user.id },
  })

  if (!databaseUser) {
    await clearUserSession(event)
    return null
  }

  return databaseUser
}

export async function requireUserAuthenticated(event: H3Event): Promise<User> {
  const { user } = await requireUserSession(event) as { user?: PublicUserInterface }

  if (!user || !user.id || typeof user.id !== "string") {
    throw createUnauthorized()
  }

  const databaseUser = await prisma.user.findUnique({
    where: { id: user.id },
  })

  if (!databaseUser) {
    await clearUserSession(event)
    throw createInvalidSession()
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
    throw createForbidden()
  }

  return user
}

export async function requireAssociationOwner(event: H3Event, associationId: string) {
  const user = await requireUserAuthenticated(event)

  // Admin users are always granted access
  if (user.roles.includes(Role.ADMIN)) {
    return user
  }

  const association = await prisma.volunteer.findFirst({
    where: { associationId: associationId, userId: user.id },
    select: {
      roles: true,
    },
  })

  if (!association) {
    throw createError({ statusCode: 404, statusMessage: "Association not found" })
  }

  if (!association.roles.includes(AssociationRole.PRESIDENT)) {
    throw createForbidden()
  }

  return user
}

/**
 * Checks if the user is a volunteer in the association
 * @param event H3Event
 * @param associationId Association ID
 * @param role Role required to access the resource
 * @returns User object if the user is a volunteer in the association
 */
export async function requireAssociationVolunteer(event: H3Event, associationId: string, role?: AssociationRole | AssociationRole[]) {
  const user = await requireUserAuthenticated(event)

  // Admin users are always granted access
  if (user.roles.includes(Role.ADMIN)) {
    return user
  }

  const volunteer = await prisma.volunteer.findFirst({
    select: {
      id: true,
      roles: true,
    },
    where: { associationId: associationId, userId: user.id },
  })

  if (!volunteer) {
    throw createForbidden()
  }

  // Check if the user has the required role
  // If no 'role' is provided, grant access to all roles
  if (role) {
    const hasRole = Array.isArray(role)
      ? role.some(r => volunteer.roles.includes(r))
      : volunteer.roles.includes(role)

    if (!hasRole) {
      throw createForbidden()
    }
  }

  return user
}
