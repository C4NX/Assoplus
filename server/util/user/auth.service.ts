import type { User } from "@prisma/client"
import jwt from "jsonwebtoken"
import type { H3Event } from "h3"
import { z } from "zod"
import prisma from "@/lib/prisma"

export const JWT_ISSUER = "ASSOPLUS"

const VerifyJwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string(),
})

export async function authenticateUserByEmail(email: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
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

export async function signVerifyTokenForUser(user: User, event: H3Event) {
  const { auth: { registerVerifySecret } } = useRuntimeConfig(event)
  return jwt.sign({ sub: user.id, email: user.email }, registerVerifySecret, {
    expiresIn: "1d",
    issuer: JWT_ISSUER,
  })
}

export async function verifyVerifyToken(token: string, event: H3Event) {
  const { auth: { registerVerifySecret } } = useRuntimeConfig(event)
  try {
    return await VerifyJwtPayloadSchema.parseAsync(
      jwt.verify(token, registerVerifySecret, {
        issuer: JWT_ISSUER,
      }),
    )
  }
  catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid token" })
  }
}

export async function authenticateUserByOauth2(provider: string, providerId: string, handleCreateUser: () => Promise<Omit<User, "id" | "discordId">>) {
  let dbUser: User | null = null

  dbUser = await prisma.user.findFirst({
    where: {
      [`${provider}Id`]: providerId,
    },
  })

  if (!dbUser) {
    const createdUser = await handleCreateUser()
    const createdDbUser = await prisma.user.create({
      data: {
        ...createdUser,
        [`${provider}Id`]: providerId,
      },
    })
    dbUser = createdDbUser
  }

  return dbUser
}
