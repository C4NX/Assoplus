import { requireUserAuthenticatedAndVerified } from "~/server/util/user/auth.guard"
import { uploadAvatarFromRequest } from "~/server/util/avatar/avatar.service"
import prisma from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const user = await requireUserAuthenticatedAndVerified(event)

  const avatarUuid = await uploadAvatarFromRequest(event, user.id, "file")
  await prisma.user.update({
    where: { id: user.id },
    data: {
      avatarUuid: avatarUuid,
    },
  })
  await replaceUserSession(event, { user: { ...user, avatarUuid: avatarUuid } })

  await setResponseStatus(event, 204)
})
