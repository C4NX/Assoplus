import { requireUserAuthenticated } from "~/server/util/user/auth.guard"
import { sanitizeUser } from "~/server/util/user/user.service"

export default defineEventHandler(async (event) => {
  return sanitizeUser(await requireUserAuthenticated(event))
})
