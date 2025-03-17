import prisma from "~/lib/prisma"
import { verifyVerifyToken } from "~/server/util/user/auth.service"

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event)

  if (!token || typeof token !== "string") {
    throw createError({ statusCode: 400, message: "Invalid token" })
  }

  const verifyToken = await verifyVerifyToken(token, event)

  const verifyUser = await prisma.user.findUnique({
    where: {
      id: verifyToken.sub,
    },
  })

  if (!verifyUser) {
    throw createError({ statusCode: 404, message: "User not found" })
  }

  if (verifyUser.isVerified) {
    throw createError({ statusCode: 400, message: "User already verified" })
  }

  if (verifyUser.id !== verifyToken.sub || verifyUser.email !== verifyToken.email) {
    throw createError({ statusCode: 400, message: "Invalid token" })
  }

  await prisma.user.update({
    where: {
      id: verifyToken.sub,
    },
    data: {
      isVerified: true,
    },
  })

  return sendRedirect(event, "/login?verified=true")
})
