import bcrypt from "bcrypt"
import type { User } from "@prisma/client"
import jwt from "jsonwebtoken"
import type { H3Event } from "h3"
import { z } from "zod"
import { sanitizeUser } from "./user.service"
import prisma from "@/lib/prisma"

export const JWT_ISSUER = "ASSOPLUS"
export const COOKIE_REFRESH_TOKEN = "ap_refresh_token"
export const COOKIE_TOKEN = "ap_token"

const JwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string(),
})

export function getJwtSecret(event: H3Event) {
  const { jwtSecret } = useRuntimeConfig(event)
  if (!jwtSecret) {
    throw new Error("JWT secret not set, please set the NUXT_JWT_SECRET environment variable")
  }
  return jwtSecret
}

export async function authenticateUserByEmail(email: string, password: string) {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: email,
    },
  })

  // The user need to have the correct password to login
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw createError({ statusCode: 401, statusMessage: "Invalid username or password" })
  }

  // The user need to be verified to login
  if (!user.isVerified) {
    throw createError({ statusCode: 401, statusMessage: "User not verified", message: "Please verify your email address" })
  }

  return user
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
  return jwt.sign({ sub: user.id, email: user.email }, `refresh:${getJwtSecret(event)}`, {
    expiresIn: "10m",
    issuer: JWT_ISSUER,
  })
}

export async function verifyAccessToken(token: string, event: H3Event) {
  try {
    return await JwtPayloadSchema.parseAsync(
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
  return await JwtPayloadSchema.parseAsync(
    jwt.verify(token, `refresh:${getJwtSecret(event)}`, {
      issuer: JWT_ISSUER,
    }),
  )
}

export async function authorizeUserSession(user: User, event: H3Event) {
  const t = await useTranslation(event)

  setCookie(event, COOKIE_REFRESH_TOKEN, await signRefreshTokenForUser(user, event), {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
  })

  setCookie(event, COOKIE_TOKEN, await signTokenForUser(user, event), {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
  })

  return {
    message: t("login.success"),
    user: sanitizeUser(user),
  }
}

export async function signVerifyTokenForUser(user: User, event: H3Event) {
  return jwt.sign({ sub: user.id, email: user.email }, `verify:${getJwtSecret(event)}`, {
    expiresIn: "1d",
    issuer: JWT_ISSUER,
  })
}

export async function verifyVerifyToken(token: string, event: H3Event) {
  try {
    return await JwtPayloadSchema.parseAsync(
      jwt.verify(token, `verify:${getJwtSecret(event)}`, {
        issuer: JWT_ISSUER,
      }),
    )
  }
  catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid token" })
  }
}

export async function logoutUser(event: H3Event) {
  // TODO: Invalidate the refresh token in the database
  deleteCookie(event, COOKIE_TOKEN)
  deleteCookie(event, COOKIE_REFRESH_TOKEN)
}
