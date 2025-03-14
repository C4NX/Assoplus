import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { defineEventHandler } from "h3"
import { z } from "zod"
import prisma from "~/lib/prisma"
import { authenticateUser, verifyRefreshToken } from "~/server/util/user/auth.service"

const RefreshRequestDto = z.object({
  refreshToken: z.string().jwt(),
})

export default defineEventHandler(async (event) => {
  const tokenRequestData = await readValidatedBody(event, RefreshRequestDto.parse)
  const refreshTokenPayload = await verifyRefreshToken(tokenRequestData.refreshToken, event)

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: refreshTokenPayload.sub,
      },
    })

    return await authenticateUser(user, event)
  }
  catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
      throw createError({ statusCode: 401, statusMessage: "Invalid refresh token" })
    }
    throw e
  }
})
