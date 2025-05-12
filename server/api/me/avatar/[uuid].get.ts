import { defineEventHandler, sendStream, setHeader } from "h3"
import { requireUserAuthenticated } from "~/server/util/user/auth.guard"
import { getAvatarStream } from "~/server/util/avatar/avatar.service"

export default defineEventHandler(async (event) => {
  const user = await requireUserAuthenticated(event)

  const stream = await getAvatarStream(user)
  if (!stream) {
    throw new Error("Failed to get avatar stream")
  }

  setHeader(event, "Content-Type", "image/webp")
  await sendStream(event, stream)
})
