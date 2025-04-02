import prisma from "@/lib/prisma"
import { z } from "zod"

const PasswordSchema = z.string().min(8).max(100)

export async function validateAndHashPassword(password: string) {
  const validatedPassword = await PasswordSchema.parseAsync(password)
  return await hashPassword(validatedPassword)
}

export async function authenticateUserByEmail(email: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
      passwordHash: { not: null },
    },
  })

  // The user need to have the correct password to login
  if (!user || !user.passwordHash || !(await verifyPassword(user.passwordHash, password))) {
    throw createError({ statusCode: 401, statusMessage: "Invalid username or password" })
  }

  // The user need to be verified to login
  if (!user.isVerified) {
    throw createError({ statusCode: 401, statusMessage: "User not verified", message: "Please verify your email address" })
  }

  return user
}