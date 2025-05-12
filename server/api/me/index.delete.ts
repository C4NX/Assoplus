import { requireUserAuthenticatedAndVerified } from "~/server/util/user/auth.guard"
import { deleteUser } from "~/server/util/user/user.service"

export default defineEventHandler(async (event) => {
  const user = await requireUserAuthenticatedAndVerified(event)

  await deleteUser(user.id)
  await clearUserSession(event)
  await setResponseStatus(event, 204)
})
