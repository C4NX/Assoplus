import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { defineEventHandler } from "h3"
import prisma from "~/lib/prisma"
import { authorizeUserSession, logoutUser, verifyRefreshToken } from "~/server/util/user/auth.service"

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "ap_refresh_token")

  if (!refreshToken) {
    throw createError({ statusCode: 401, statusMessage: "No refresh token provided" })
  }

  // Verify the refresh token, and clear the session if it's invalid
  let refreshTokenPayload = null
  try {
    refreshTokenPayload = await verifyRefreshToken(refreshToken, event)
  }
  catch (e) {
    // POV: The types dont'work server-side so you made this shit
    if (e !== null && typeof e === "object" && "name" in e && e.name === "TokenExpiredError") {
      await logoutUser(event)
      throw createError({ statusCode: 401, statusMessage: "Refresh token expired" })
    }
    throw e
  }

  // Find the user and authorize the session, and clear the session if the user is not found
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: refreshTokenPayload.sub,
      },
    })

    return await authorizeUserSession(user, event)
  }
  catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
      logoutUser(event)
      throw createError({ statusCode: 401, statusMessage: "Invalid refresh token" })
    }
    throw e
  }
})
