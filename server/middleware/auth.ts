import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import type { User } from "@prisma/client"
import { verifyAccessToken, COOKIE_TOKEN, logoutUser } from "~/server/util/user/auth.service"
import prisma from "~/lib/prisma"

declare module "h3" {
  interface H3EventContext {
    auth?: {
      user: User
    }
  }
}

export default defineEventHandler(async (event) => {
  const token = getCookie(event, COOKIE_TOKEN)
  if (token) {
    const { sub } = await verifyAccessToken(token, event)

    try {
      event.context.auth = {
        user: await prisma.user.findUniqueOrThrow({
          where: {
            id: sub,
          },
        }),
      }
    }
    catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        logoutUser(event)
        throw createError({ statusCode: 401, statusMessage: "Invalid user" })
      }
      throw e
    }
  }
})
