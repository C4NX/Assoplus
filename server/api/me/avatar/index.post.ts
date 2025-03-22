import { PutObjectCommand } from "@aws-sdk/client-s3"
import sharp from "sharp"
import { v4 as uuidv4 } from "uuid"
import type { H3Event } from "h3"
import s3Client from "~/lib/s3client"
import { requireUserAuthenticated } from "~/server/util/user/auth.guard"
import prisma from "~/lib/prisma"
import { createLogger } from "~/server/util/logger/logger.service"

const logger = createLogger("api/me/avatar")

async function convertProfilePicture(buffer: Buffer) {
  return await sharp(buffer)
    .webp()
    .resize(512, 512)
    .toBuffer()
}

async function checkAndGetImageBuffer(event: H3Event, formName: string) {
  const multipartFormData = await readMultipartFormData(event)

  const fileIndex = multipartFormData?.findIndex(({ name }) => name === formName)

  if (multipartFormData === undefined || fileIndex === -1 || fileIndex === undefined) {
    throw createError({ statusCode: 400, statusMessage: "Invalid request" })
  }

  if (!["image/jpeg", "image/png"].includes(multipartFormData[fileIndex].type ?? "")) {
    throw createError({ statusCode: 400, statusMessage: "Invalid file type" })
  }

  return multipartFormData[fileIndex].data
}

export default defineEventHandler(async (event) => {
  const user = await requireUserAuthenticated(event)

  const { s3: { bucket } } = useRuntimeConfig(event)

  const imageBuffer = await checkAndGetImageBuffer(event, "file")

  const newImageUuid = uuidv4()
  const s3Key = `avatars/${user.id}/${newImageUuid}`
  await s3Client?.send(new PutObjectCommand({
    Bucket: bucket,
    Key: s3Key,
    Body: await convertProfilePicture(imageBuffer),
  }))

  await prisma.user.update({
    where: { id: user.id },
    data: {
      avatarUuid: newImageUuid,
    },
  })
  await replaceUserSession(event, { user: { ...user, avatarUuid: newImageUuid } })

  logger.trace(`User ${user.id} uploaded a new avatar`)

  await setResponseStatus(event, 204)
})
