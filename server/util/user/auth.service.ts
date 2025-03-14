import bcrypt from "bcrypt"
import type { User } from "@prisma/client"
import jwt from "jsonwebtoken"
import type { H3Event } from "h3"
import { z } from "zod"
import prisma from "@/lib/prisma"

const JWT_ISSUER = "ASSOPLUS"

const JwtPayload = z.object({
  sub: z.string(),
  email: z.string(),
})

const JwtRefreshPayload = z.object({
  sub: z.string(),
})

export function getJwtSecret(event: H3Event) {
  const { jwtSecret } = useRuntimeConfig(event)
  if (!jwtSecret) {
    throw new Error("JWT secret not set, please set the NUXT_JWT_SECRET environment variable")
  }
  return jwtSecret
}

export async function verifyPasswordAndReturnUser(email: string, password: string) {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: email,
      },
    })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error("Password does not match")
    }

    return user
  }
  catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid username or password" })
  }
}

export async function signTokenForUser(user: User, event: H3Event) {
  const { jwtSecret } = useRuntimeConfig(event)
  if (!jwtSecret) {
    throw new Error("JWT secret not set, please set the NUXT_JWT_SECRET environment variable")
  }

  return jwt.sign({ sub: user.id, email: user.email }, `login:${jwtSecret}`, {
    expiresIn: "1h",
    issuer: JWT_ISSUER,
  })
}

export async function signRefreshTokenForUser(user: User, event: H3Event) {
  return jwt.sign({ sub: user.id }, `refresh:${getJwtSecret(event)}`, {
    expiresIn: "7d",
    issuer: JWT_ISSUER,
  })
}

export async function verifyAccessToken(token: string, event: H3Event) {
  try {
    return await JwtPayload.parseAsync(
      jwt.verify(token, `login:${getJwtSecret(event)}`, {
        issuer: JWT_ISSUER,
      }),
    )
  }
  catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid token" })
  }
}

export async function verifyRefreshToken(token: string, event: H3Event) {
  try {
    return await JwtRefreshPayload.parseAsync(
      jwt.verify(token, `refresh:${getJwtSecret(event)}`, {
        issuer: JWT_ISSUER,
      }),
    )
  }
  catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid token" })
  }
}

export async function authenticateUser(user: User, event: H3Event) {
  return {
    token: await signTokenForUser(user, event),
    refreshToken: await signRefreshTokenForUser(user, event),
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  }
}
