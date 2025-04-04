import { requireUserAuthenticated } from "~/server/util/user/auth.guard"
import { deleteUser } from "~/server/util/user/user.service"

export default defineEventHandler(async (event) => {
  const user = await requireUserAuthenticated(event)

  await clearUserSession(event)
  await deleteUser(user.id)
  await setResponseStatus(event, 204)
})
