import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { verifyAccessToken } from "../util/user/auth.service"
import prisma from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  if (event.headers.has("Authorization")) {
    const authorizationHeader = event.headers.get("Authorization")?.split(" ")
    if (!authorizationHeader || authorizationHeader.length !== 2 || authorizationHeader[0] !== "Bearer") {
      throw createError({ statusCode: 401, statusMessage: "Invalid Authorization header" })
    }

    const { sub } = await verifyAccessToken(authorizationHeader[1], event)

    try {
      event.context.auth = await prisma.user.findUniqueOrThrow({
        where: {
          id: sub,
        },
      })
    }
    catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw createError({ statusCode: 401, statusMessage: "Invalid user" })
      }
      throw e
    }
  }
})
