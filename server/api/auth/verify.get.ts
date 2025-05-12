import { verifyUserAccount } from "~/server/util/user/verify.service"

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event)

  if (!token || typeof token !== "string") {
    throw createError({ statusCode: 400, message: "Invalid token" })
  }

  await verifyUserAccount(event, token)

  return sendRedirect(event, "/login?verified=true")
})
