import { requireUserAuthenticated } from "~/server/util/user/auth.guard"
import { sanitizeUser } from "~/server/util/user/user.service"

export default defineEventHandler(async (event) => {
  await requireUserAuthenticated(event)

  if (!event.context.auth) {
    throw createError({ statusCode: 401, statusMessage: "Invalid user" })
  }

  return sanitizeUser(event.context.auth?.user)
})
