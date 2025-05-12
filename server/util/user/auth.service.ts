import { z } from "zod"
import type { H3Event } from "h3"
import { sendVerificationEmail } from "./verify.service"
import { sanitizeUser } from "./user.service"
import prisma from "@/lib/prisma"

export const PasswordSchema = z.string().min(8).max(100)

/**
 * Validate and hash the password
 * @param password The password to hash
 * @returns The hashed password
 * @throws {ZodError} If the password is not valid
 */
export async function validateAndHashPassword(password: string) {
  const validatedPassword = await PasswordSchema.parseAsync(password)
  return await hashPassword(validatedPassword)
}

export async function authenticateUserByEmail(event: H3Event, email: string, password: string) {
  const t = await useTranslation(event)

  const user = await prisma.user.findFirst({
    where: {
      email: email,
      passwordHash: { not: null },
    },
  })

  // The user need to have the correct password to login
  if (!user || !user.passwordHash || !(await verifyPassword(user.passwordHash, password))) {
    throw createError({ statusCode: 401, statusMessage: "Invalid credentials", message: t("login.invalid_credentials") })
  }

  // The user need to be verified to login
  if (!user.isVerified) {
    await sendVerificationEmail(event, user)
    throw createError({ statusCode: 401, statusMessage: "User not verified", message: t("login.account_not_verified") })
  }

  await setUserSession(event, {
    user: sanitizeUser(user),
    loggedInAt: Date.now(),
  })

  return user
}
