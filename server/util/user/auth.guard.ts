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

export function createUserNotVerified() {
  return createError({ statusCode: 403, statusMessage: "User is not verified" })
}

/**
 * Try to get the authenticated user from the session, this will also check if the user is verified.
 * @param event H3Event
 * @returns User object if the user is authenticated and verified, null if not authenticated or not verified
 */
export async function tryGetAuthenticatedUserAndVerified(event: H3Event): Promise<User | null> {
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

  if (!user.isVerified) {
    throw createUserNotVerified()
  }

  return databaseUser
}

/**
 * Require the user to be authenticated and verified
 * @param event H3Event
 * @returns User object if the user is authenticated and verified
 */
export async function requireUserAuthenticatedAndVerified(event: H3Event): Promise<User> {
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

  if (!user.isVerified) {
    throw createUserNotVerified()
  }

  return databaseUser
}

/**
 * Require the user to be authenticated and verified
 * @param event H3Event
 * @param permissions Role or array of roles to check
 * @returns User object if the user is authenticated and has the required permissions
 */
export async function requireUserGrantedAndVerified(event: H3Event, permissions: Role | Role[]) {
  const user = await requireUserAuthenticatedAndVerified(event)
  const userRoles = user?.roles || []

  const hasPermission = Array.isArray(permissions)
    ? permissions.some(permission => userRoles.includes(permission))
    : userRoles.includes(permissions)

  if (!hasPermission) {
    throw createForbidden()
  }

  return user
}

/**
 * Checks if the user is the owner of the association
 * @param event H3Event
 * @param associationId Association ID
 * @returns User object if the user is the owner of the association
 */
export async function requireAssociationOwner(event: H3Event, associationId: string) {
  const user = await requireUserAuthenticatedAndVerified(event)

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
  const user = await requireUserAuthenticatedAndVerified(event)

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
