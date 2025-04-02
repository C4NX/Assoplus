import { requireUserAuthenticated } from "~/server/util/user/auth.guard"
import { createLogger } from "~/server/util/logger/logger.service"
import { uploadAvatarFromRequest } from "~/server/util/avatar/avatar.service"



export default defineEventHandler(async (event) => {
  const user = await requireUserAuthenticated(event)

  const avatarUuid = await uploadAvatarFromRequest(event, user.id, "file")
  await replaceUserSession(event, { user: { ...user, avatarUuid: avatarUuid } })

  await setResponseStatus(event, 204)
})
