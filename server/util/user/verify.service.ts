import { z } from "zod"
import jwt from "jsonwebtoken"
import type { H3Event } from "h3"
import type { User } from "@prisma/client"

export const JWT_ISSUER = "ASSOPLUS"

const VerifyJwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string(),
})

export async function signVerifyTokenForUser(user: User, event: H3Event) {
  const { auth: { registerVerifySecret } } = useRuntimeConfig(event)
  return jwt.sign({ sub: user.id, email: user.email }, registerVerifySecret, {
    expiresIn: "1d",
    issuer: JWT_ISSUER,
  })
}

export async function validateVerifyToken(token: string, event: H3Event) {
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
