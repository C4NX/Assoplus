import { createReadStream } from "fs"
import { GetObjectCommand, NoSuchKey } from "@aws-sdk/client-s3"
import { createError, defineEventHandler, getRouterParam, sendStream, setHeader, type H3Event } from "h3"
import s3Client from "~/lib/s3client"
import { requireUserAuthenticated } from "~/server/util/user/auth.guard"

function sendDefaultAvatar(event: H3Event) {
  return sendStream(event, createReadStream("public/pexels-juan-pablo-guardia-137931772-18504011.jpg"))
}

export default defineEventHandler(async (event) => {
  const user = await requireUserAuthenticated(event)

  const { s3: { bucket } } = useRuntimeConfig(event)

  const avatarUuid = getRouterParam(event, "uuid")

  if (!avatarUuid || typeof avatarUuid !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Invalid request" })
  }

  if (avatarUuid === "default") {
    return sendDefaultAvatar(event)
  }

  let result
  try {
    result = await s3Client?.send(new GetObjectCommand({
      Bucket: bucket,
      Key: `avatars/${user.id}/${avatarUuid}`,
    }))
  }
  catch (error) {
    if (error instanceof NoSuchKey) {
      return sendDefaultAvatar(event)
    }
    throw error
  }

  const stream = result?.Body?.transformToWebStream()
  if (!stream) {
    throw createError({ statusCode: 404, statusMessage: "Not found" })
  }

  setHeader(event, "Content-Type", "image/webp")
  await sendStream(event, stream)
})
